// frontend/app/(tabs)/add.tsx
import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { transactionService } from '../../services/transactionServices';
import { BaseText } from '../../components/common/BaseText';

type TxnType = 'debit' | 'credit';

const GREEN       = '#2E7D32';
const RED         = '#C62828';
const SURFACE     = '#FFFFFF';
const BG          = '#F5F9F5';
const BORDER      = '#E0E0E0';
const TEXT        = '#1A1A1A';
const MUTED       = '#757575';
const MUTED_LIGHT = '#F5F5F5';

function formatDisplayDate(d: Date) {
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}
function formatDisplayTime(d: Date) {
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}

export default function Add() {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const [amount, setAmount]       = useState('');
  const [type, setType]           = useState<TxnType>('debit');
  const [accountLast4, setAcct]   = useState('');
  const [note, setNote]           = useState('');
  const [datetime, setDatetime]   = useState(new Date());
  const [showDate, setShowDate]   = useState(false);
  const [showTime, setShowTime]   = useState(false);

  useFocusEffect(
    useCallback(() => {
      setVisible(true);
      return () => setVisible(false);
    }, [])
  );

  const resetForm = () => {
    setAmount(''); setType('debit'); setAcct(''); setNote(''); setDatetime(new Date());
  };

  const dismiss = () => { resetForm(); setVisible(false); router.back(); };

  const handleSave = async () => {
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      Alert.alert('Required', 'Enter a valid amount.'); return;
    }
    if (accountLast4.length !== 4) {
      Alert.alert('Required', 'Enter the last 4 digits of your account.'); return;
    }
    setLoading(true);
    try {
      await transactionService.add({
        amount: parseFloat(amount),
        type,
        raw_sms: note || `Manual entry — Nu. ${amount}`,
        reference_id: `TXN_${Date.now()}`,
        timestamp: datetime.toISOString(),
        account_last4: accountLast4,
        source: 'manual',
      });
      setLoading(false);
      Alert.alert('Saved', 'Transaction recorded.', [{ text: 'OK', onPress: dismiss }]);
    } catch {
      setLoading(false);
      Alert.alert('Error', 'Could not save. Please try again.');
    }
  };

  const onDateChange = (_: any, selected?: Date) => {
    setShowDate(false);
    if (selected) {
      const m = new Date(datetime);
      m.setFullYear(selected.getFullYear(), selected.getMonth(), selected.getDate());
      setDatetime(m);
    }
  };

  const onTimeChange = (_: any, selected?: Date) => {
    setShowTime(false);
    if (selected) {
      const m = new Date(datetime);
      m.setHours(selected.getHours(), selected.getMinutes());
      setDatetime(m);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={dismiss}
    >
      {/* Frosted glass root */}
      <BlurView intensity={0} tint="light" style={s.blurRoot}>
        <KeyboardAvoidingView
          style={s.root}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {/* ── Header — no colour, just text + close ── */}
          <View style={s.header}>
            <View style={s.headerHandle} />
            <View style={s.headerRow}>
              <View>
                <BaseText style={s.headerTitle}>New Transaction</BaseText>
                <BaseText style={s.headerSub}>Fill in the details below</BaseText>
              </View>
              <TouchableOpacity onPress={dismiss} style={s.closeBtn}>
                <BaseText style={s.closeX}>✕</BaseText>
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView
            style={s.scroll}
            contentContainerStyle={s.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Type */}
            <BaseText style={s.label}>Type</BaseText>
            <View style={s.toggle}>
              {(['debit', 'credit'] as TxnType[]).map(t => (
                <TouchableOpacity
                  key={t}
                  style={[s.toggleBtn, type === t && (t === 'debit' ? s.toggleDebit : s.toggleCredit)]}
                  onPress={() => setType(t)}
                  activeOpacity={0.8}
                >
                  <BaseText style={[s.toggleText, type === t && s.toggleTextActive]}>
                    {t === 'debit' ? 'Debit' : 'Credit'}
                  </BaseText>
                </TouchableOpacity>
              ))}
            </View>

            {/* Amount */}
            <BaseText style={s.label}>Amount</BaseText>
            <View style={s.inputRow}>
              <View style={s.prefix}>
                <BaseText style={s.prefixText}>Nu.</BaseText>
              </View>
              <TextInput
                style={s.inputFlex}
                placeholder="0.00"
                placeholderTextColor={MUTED}
                keyboardType="decimal-pad"
                value={amount}
                onChangeText={setAmount}
              />
            </View>

            {/* Account */}
            <BaseText style={s.label}>Account (Last 4 digits)</BaseText>
            <View style={s.inputRow}>
              <View style={s.prefix}>
                <BaseText style={s.prefixText}>••••</BaseText>
              </View>
              <TextInput
                style={s.inputFlex}
                placeholder="1234"
                placeholderTextColor={MUTED}
                keyboardType="number-pad"
                maxLength={4}
                value={accountLast4}
                onChangeText={setAcct}
              />
            </View>

            {/* Date & Time */}
            <BaseText style={s.label}>Date & Time</BaseText>
            <View style={s.dateTimeRow}>
              <TouchableOpacity style={s.dateTimeBtn} onPress={() => setShowDate(true)} activeOpacity={0.7}>
                <BaseText style={s.dateTimeBtnLabel}>Date</BaseText>
                <BaseText style={s.dateTimeBtnValue}>{formatDisplayDate(datetime)}</BaseText>
              </TouchableOpacity>
              <View style={s.dateTimeDivider} />
              <TouchableOpacity style={s.dateTimeBtn} onPress={() => setShowTime(true)} activeOpacity={0.7}>
                <BaseText style={s.dateTimeBtnLabel}>Time</BaseText>
                <BaseText style={s.dateTimeBtnValue}>{formatDisplayTime(datetime)}</BaseText>
              </TouchableOpacity>
            </View>

            {showDate && (
              <DateTimePicker
                value={datetime}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onDateChange}
                maximumDate={new Date()}
              />
            )}
            {showTime && (
              <DateTimePicker
                value={datetime}
                mode="time"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onTimeChange}
              />
            )}

            {/* Note */}
            <BaseText style={s.label}>
              Note <BaseText style={s.optional}>(optional)</BaseText>
            </BaseText>
            <TextInput
              style={[s.inputBase, s.textArea]}
              placeholder="Add a note…"
              placeholderTextColor={MUTED}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              value={note}
              onChangeText={setNote}
            />

            <View style={{ height: 20 }} />
          </ScrollView>

          {/* Footer */}
          <View style={s.footer}>
            <TouchableOpacity style={s.cancelBtn} onPress={dismiss} activeOpacity={0.7}>
              <BaseText style={s.cancelText}>Cancel</BaseText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.saveBtn, loading && s.saveBtnDim]}
              onPress={handleSave}
              disabled={loading}
              activeOpacity={0.85}
            >
              <BaseText style={s.saveText}>{loading ? 'Saving…' : 'Save'}</BaseText>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </BlurView>
    </Modal>
  );
}

const s = StyleSheet.create({
  blurRoot: { flex: 1, backgroundColor: BG },
  root:     { flex: 1 },

  header: {
    paddingTop: Platform.OS === 'ios' ? 12 : 16,
    paddingBottom: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    backgroundColor: SURFACE,
  },
  headerHandle: {
    width: 36, height: 4, borderRadius: 2,
    backgroundColor: BORDER, alignSelf: 'center', marginBottom: 14,
  },
  headerRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: TEXT },
  headerSub:   { fontSize: 13, color: MUTED, marginTop: 2 },
  closeBtn: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: MUTED_LIGHT, alignItems: 'center', justifyContent: 'center',
  },
  closeX: { fontSize: 13, color: MUTED, fontWeight: '600' },

  scroll:        { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 8 },

  label:    { fontSize: 12, fontWeight: '600', color: MUTED, marginBottom: 8, marginTop: 18, textTransform: 'uppercase', letterSpacing: 0.4 },
  optional: { fontSize: 12, fontWeight: '400', color: MUTED, textTransform: 'none' },

  toggle:           { flexDirection: 'row', backgroundColor: '#EBEBEB', borderRadius: 10, padding: 3 },
  toggleBtn:        { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  toggleDebit:      { backgroundColor: RED },
  toggleCredit:     { backgroundColor: GREEN },
  toggleText:       { fontSize: 14, fontWeight: '600', color: MUTED },
  toggleTextActive: { color: '#FFF' },

  inputBase: {
    backgroundColor: SURFACE, borderRadius: 10, borderWidth: 1,
    borderColor: BORDER, paddingHorizontal: 14, paddingVertical: 13,
    fontSize: 15, color: TEXT,
  },
  inputRow: {
    flexDirection: 'row', backgroundColor: SURFACE, borderRadius: 10,
    borderWidth: 1, borderColor: BORDER, alignItems: 'center', overflow: 'hidden',
  },
  prefix: {
    paddingHorizontal: 14, paddingVertical: 13,
    backgroundColor: MUTED_LIGHT, borderRightWidth: 1, borderRightColor: BORDER,
  },
  prefixText: { fontSize: 14, fontWeight: '600', color: MUTED },
  inputFlex:  { flex: 1, paddingHorizontal: 14, paddingVertical: 13, fontSize: 15, color: TEXT },

  dateTimeRow: {
    flexDirection: 'row', backgroundColor: SURFACE, borderRadius: 10,
    borderWidth: 1, borderColor: BORDER, overflow: 'hidden',
  },
  dateTimeBtn:       { flex: 1, paddingHorizontal: 14, paddingVertical: 13 },
  dateTimeDivider:   { width: 1, backgroundColor: BORDER },
  dateTimeBtnLabel:  { fontSize: 11, color: MUTED, fontWeight: '500', marginBottom: 3 },
  dateTimeBtnValue:  { fontSize: 14, fontWeight: '600', color: TEXT },

  textArea: { minHeight: 80, paddingTop: 12 },

  footer: {
    flexDirection: 'row', gap: 10, padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    backgroundColor: SURFACE, borderTopWidth: 1, borderTopColor: BORDER,
  },
  cancelBtn: {
    flex: 1, paddingVertical: 14, borderRadius: 10,
    borderWidth: 1, borderColor: BORDER, alignItems: 'center',
  },
  cancelText:  { fontSize: 15, fontWeight: '600', color: MUTED },
  saveBtn:     { flex: 2, paddingVertical: 14, borderRadius: 10, backgroundColor: GREEN, alignItems: 'center' },
  saveBtnDim:  { opacity: 0.6 },
  saveText:    { fontSize: 15, fontWeight: '700', color: '#FFF' },
});