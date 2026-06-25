// frontend/app/(tabs)/transactions.tsx
import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Platform,
  ActivityIndicator,
  Animated,
  Pressable,
  TextInput,
  Alert,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { transactionService } from '../../services/transactionServices';
import { BaseText } from '../../components/common/BaseText';

interface Transaction {
  _id: string;
  user: string;
  raw_sms: string;
  type: 'debit' | 'credit';
  amount: number;
  currency: string;
  reference_id: string;
  timestamp: string;
  account_last4: string;
  source: 'manual' | 'sms' | 'bank';
  createdAt: string;
  updatedAt: string;
}

const GREEN       = '#2E7D32';
const RED         = '#C62828';
const SURFACE     = '#FFFFFF';
const BG          = '#F5F9F5';
const BORDER      = '#E0E0E0';
const TEXT        = '#1A1A1A';
const MUTED       = '#757575';
const MUTED_LIGHT = '#F5F5F5';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}
function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}
function formatDisplayTime(d: Date) {
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}
function formatAmount(n: number) {
  return n.toLocaleString('en-IN');
}

// ── Edit Modal ─────────────────────────────────────────────────────────────
function EditModal({
  item,
  onClose,
  onSaved,
}: {
  item: Transaction | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [amount, setAmount]   = useState('');
  const [type, setType]       = useState<'debit' | 'credit'>('debit');
  const [acct, setAcct]       = useState('');
  const [note, setNote]       = useState('');
  const [datetime, setDt]     = useState(new Date());
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [loading, setLoading] = useState(false);

  // Seed form when item changes
  useEffect(() => {
    if (item) {
      setAmount(String(item.amount));
      setType(item.type);
      setAcct(item.account_last4);
      setNote(item.raw_sms);
      setDt(new Date(item.timestamp));
    }
  }, [item]);

  if (!item) return null;

  const handleSave = async () => {
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      Alert.alert('Required', 'Enter a valid amount.'); return;
    }
    if (acct.length !== 4) {
      Alert.alert('Required', 'Account must be 4 digits.'); return;
    }
    setLoading(true);
    try {
      await transactionService.update(item._id, {
        amount: parseFloat(amount),
        type,
        raw_sms: note,
        account_last4: acct,
        timestamp: datetime.toISOString(),
      });
      onSaved();
      onClose();
    } catch {
      Alert.alert('Error', 'Could not update transaction.');
    } finally {
      setLoading(false);
    }
  };

  const onDateChange = (_: any, selected?: Date) => {
    setShowDate(false);
    if (selected) { const m = new Date(datetime); m.setFullYear(selected.getFullYear(), selected.getMonth(), selected.getDate()); setDt(m); }
  };
  const onTimeChange = (_: any, selected?: Date) => {
    setShowTime(false);
    if (selected) { const m = new Date(datetime); m.setHours(selected.getHours(), selected.getMinutes()); setDt(m); }
  };

  return (
    <Modal visible={!!item} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={e.root}>
        {/* Header */}
        <View style={e.header}>
          <View style={e.handle} />
          <View style={e.headerRow}>
            <View>
              <BaseText style={e.headerTitle}>Edit Transaction</BaseText>
              <BaseText style={e.headerSub}>{item.reference_id}</BaseText>
            </View>
            <TouchableOpacity onPress={onClose} style={e.closeBtn}>
              <BaseText style={e.closeX}>✕</BaseText>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={e.scroll} contentContainerStyle={e.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {/* Type */}
          <BaseText style={e.label}>Type</BaseText>
          <View style={e.toggle}>
            {(['debit', 'credit'] as const).map(t => (
              <TouchableOpacity
                key={t}
                style={[e.toggleBtn, type === t && (t === 'debit' ? e.toggleDebit : e.toggleCredit)]}
                onPress={() => setType(t)}
                activeOpacity={0.8}
              >
                <BaseText style={[e.toggleText, type === t && e.toggleTextActive]}>
                  {t === 'debit' ? 'Debit' : 'Credit'}
                </BaseText>
              </TouchableOpacity>
            ))}
          </View>

          {/* Amount */}
          <BaseText style={e.label}>Amount</BaseText>
          <View style={e.inputRow}>
            <View style={e.prefix}><BaseText style={e.prefixText}>Nu.</BaseText></View>
            <TextInput style={e.inputFlex} placeholder="0.00" placeholderTextColor={MUTED} keyboardType="decimal-pad" value={amount} onChangeText={setAmount} />
          </View>

          {/* Account */}
          <BaseText style={e.label}>Account (Last 4 digits)</BaseText>
          <View style={e.inputRow}>
            <View style={e.prefix}><BaseText style={e.prefixText}>••••</BaseText></View>
            <TextInput style={e.inputFlex} placeholder="1234" placeholderTextColor={MUTED} keyboardType="number-pad" maxLength={4} value={acct} onChangeText={setAcct} />
          </View>

          {/* Date & Time */}
          <BaseText style={e.label}>Date & Time</BaseText>
          <View style={e.dateTimeRow}>
            <TouchableOpacity style={e.dateTimeBtn} onPress={() => setShowDate(true)} activeOpacity={0.7}>
              <BaseText style={e.dateTimeBtnLabel}>Date</BaseText>
              <BaseText style={e.dateTimeBtnValue}>{formatDate(datetime.toISOString())}</BaseText>
            </TouchableOpacity>
            <View style={e.dateTimeDivider} />
            <TouchableOpacity style={e.dateTimeBtn} onPress={() => setShowTime(true)} activeOpacity={0.7}>
              <BaseText style={e.dateTimeBtnLabel}>Time</BaseText>
              <BaseText style={e.dateTimeBtnValue}>{formatDisplayTime(datetime)}</BaseText>
            </TouchableOpacity>
          </View>
          {showDate && <DateTimePicker value={datetime} mode="date" display={Platform.OS === 'ios' ? 'spinner' : 'default'} onChange={onDateChange} maximumDate={new Date()} />}
          {showTime && <DateTimePicker value={datetime} mode="time" display={Platform.OS === 'ios' ? 'spinner' : 'default'} onChange={onTimeChange} />}

          {/* Note */}
          <BaseText style={e.label}>Note <BaseText style={e.optional}>(optional)</BaseText></BaseText>
          <TextInput style={[e.inputBase, e.textArea]} placeholder="Add a note…" placeholderTextColor={MUTED} multiline numberOfLines={3} textAlignVertical="top" value={note} onChangeText={setNote} />

          <View style={{ height: 20 }} />
        </ScrollView>

        {/* Footer */}
        <View style={e.footer}>
          <TouchableOpacity style={e.cancelBtn} onPress={onClose} activeOpacity={0.7}>
            <BaseText style={e.cancelText}>Cancel</BaseText>
          </TouchableOpacity>
          <TouchableOpacity style={[e.saveBtn, loading && e.saveBtnDim]} onPress={handleSave} disabled={loading} activeOpacity={0.85}>
            <BaseText style={e.saveText}>{loading ? 'Saving…' : 'Save Changes'}</BaseText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ── Detail bottom sheet ─────────────────────────────────────────────────────
function DetailSheet({
  item,
  onClose,
  onEdit,
  onDelete,
}: {
  item: Transaction | null;
  onClose: () => void;
  onEdit: (item: Transaction) => void;
  onDelete: (item: Transaction) => void;
}) {
  const slideY  = useRef(new Animated.Value(400)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (item) {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 220, useNativeDriver: true }),
        Animated.spring(slideY, { toValue: 0, useNativeDriver: true, bounciness: 4, speed: 14 }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0, duration: 180, useNativeDriver: true }),
        Animated.timing(slideY, { toValue: 400, duration: 180, useNativeDriver: true }),
      ]).start();
    }
  }, [item, opacity, slideY]);

  if (!item) return null;

  const isDebit = item.type === 'debit';
  const rows = [
    { label: 'Reference', value: item.reference_id },
    { label: 'Account',   value: `••••${item.account_last4}` },
    { label: 'Source',    value: item.source.charAt(0).toUpperCase() + item.source.slice(1) },
    { label: 'Date',      value: formatDate(item.timestamp) },
    { label: 'Time',      value: formatTime(item.timestamp) },
    { label: 'Note',      value: item.raw_sms },
    { label: 'Recorded',  value: formatDate(item.createdAt) },
  ];

  return (
    <Modal visible={!!item} transparent animationType="none" onRequestClose={onClose}>
      <Animated.View style={[d.backdrop, { opacity }]}>
        <BlurView intensity={18} tint="dark" style={StyleSheet.absoluteFill} />
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      <Animated.View style={[d.sheet, { transform: [{ translateY: slideY }] }]}>
        <View style={d.handle} />

        {/* Amount header */}
        <View style={d.sheetHeader}>
          <View>
            <BaseText style={d.sheetType}>{isDebit ? 'Debit' : 'Credit'}</BaseText>
            <BaseText style={[d.sheetAmount, { color: isDebit ? RED : GREEN }]}>
              {isDebit ? '-' : '+'} Nu. {formatAmount(item.amount)}
            </BaseText>
          </View>
          <TouchableOpacity onPress={onClose} style={d.closeBtn}>
            <BaseText style={d.closeText}>✕</BaseText>
          </TouchableOpacity>
        </View>

        {/* Detail rows */}
        <ScrollView style={d.rowsScroll} contentContainerStyle={d.rowsContent} showsVerticalScrollIndicator={false}>
          {rows.map((row, i) => (
            <View key={i} style={[d.row, i < rows.length - 1 && d.rowBorder]}>
              <BaseText style={d.rowLabel}>{row.label}</BaseText>
              <BaseText style={d.rowValue} numberOfLines={2}>{row.value}</BaseText>
            </View>
          ))}
        </ScrollView>

        {/* Action buttons */}
        <View style={d.actions}>
          <TouchableOpacity
            style={d.editBtn}
            onPress={() => { onClose(); setTimeout(() => onEdit(item), 300); }}
            activeOpacity={0.7}
          >
            <BaseText style={d.editBtnText}>Edit</BaseText>
          </TouchableOpacity>
          <TouchableOpacity
            style={d.deleteBtn}
            onPress={() => onDelete(item)}
            activeOpacity={0.7}
          >
            <BaseText style={d.deleteBtnText}>Delete</BaseText>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  );
}

// ── Main screen ─────────────────────────────────────────────────────────────
export default function Transactions() {
  const insets = useSafeAreaInsets();
  const [data, setData]             = useState<Transaction[]>([]);
  const [selected, setSelected]     = useState<Transaction | null>(null);
  const [editing, setEditing]       = useState<Transaction | null>(null);
  const [loading, setLoading]       = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter]         = useState<'all' | 'debit' | 'credit'>('all');

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await transactionService.getAll();
      setData(res);
    } catch { /* silent */ }
    finally { setLoading(false); setRefreshing(false); }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));
  const onRefresh = () => { setRefreshing(true); load(true); };
  const filtered  = filter === 'all' ? data : data.filter(t => t.type === filter);

  const handleDelete = (item: Transaction) => {
    Alert.alert(
      'Delete Transaction',
      `Remove ${item.reference_id}? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete', style: 'destructive',
          onPress: async () => {
            try {
              await transactionService.delete(item._id);
              setSelected(null);
              load(true);
            } catch {
              Alert.alert('Error', 'Could not delete transaction.');
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: Transaction }) => {
    const isDebit = item.type === 'debit';
    return (
      <TouchableOpacity style={s.card} onPress={() => setSelected(item)} activeOpacity={0.6}>
        <View style={s.cardLeft}>
          <BaseText style={s.cardRef} numberOfLines={1}>{item.reference_id}</BaseText>
          <BaseText style={s.cardNote} numberOfLines={1}>{item.raw_sms}</BaseText>
          <BaseText style={s.cardDate}>{formatDate(item.timestamp)}</BaseText>
        </View>
        <View style={s.cardRight}>
          <BaseText style={[s.cardAmount, { color: isDebit ? RED : GREEN }]}>
            {isDebit ? '-' : '+'} Nu. {formatAmount(item.amount)}
          </BaseText>
          <BaseText style={s.cardAcct}>••••{item.account_last4}</BaseText>
        </View>
      </TouchableOpacity>
    );
  };

  const ListHeader = () => {
    const totalDebit  = data.filter(t => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0);
    const totalCredit = data.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0);
    return (
      <View>
        <View style={s.summaryRow}>
          <View style={s.summaryCard}>
            <BaseText style={s.summaryLabel}>Total Debit</BaseText>
            <BaseText style={[s.summaryAmount, { color: RED }]}>Nu. {formatAmount(totalDebit)}</BaseText>
          </View>
          <View style={s.summaryDivider} />
          <View style={s.summaryCard}>
            <BaseText style={s.summaryLabel}>Total Credit</BaseText>
            <BaseText style={[s.summaryAmount, { color: GREEN }]}>Nu. {formatAmount(totalCredit)}</BaseText>
          </View>
        </View>
        <View style={s.filterRow}>
          {(['all', 'debit', 'credit'] as const).map(f => (
            <TouchableOpacity
              key={f}
              style={[s.filterBtn, filter === f && s.filterBtnActive]}
              onPress={() => setFilter(f)}
              activeOpacity={0.7}
            >
              <BaseText style={[s.filterText, filter === f && s.filterTextActive]}>
                {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
              </BaseText>
            </TouchableOpacity>
          ))}
        </View>
        <BaseText style={s.countLabel}>{filtered.length} transaction{filtered.length !== 1 ? 's' : ''}</BaseText>
      </View>
    );
  };

  const ListEmpty = () => (
    <View style={s.empty}>
      <BaseText style={s.emptyTitle}>No transactions</BaseText>
      <BaseText style={s.emptyNote}>Tap + to add one.</BaseText>
    </View>
  );

  return (
    <View style={[s.screen, { paddingTop: insets.top }]}>
      <View style={s.pageHeader}>
        <BaseText style={s.pageTitle}>Transactions</BaseText>
        <BaseText style={s.pageSub}>Your spending history</BaseText>
      </View>

      {loading ? (
        <View style={s.loader}><ActivityIndicator size="large" color={GREEN} /></View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item._id}
          renderItem={renderItem}
          ListHeaderComponent={<ListHeader />}
          ListEmptyComponent={<ListEmpty />}
          contentContainerStyle={s.list}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={GREEN} colors={[GREEN]} />}
        />
      )}

      <DetailSheet
        item={selected}
        onClose={() => setSelected(null)}
        onEdit={setEditing}
        onDelete={handleDelete}
      />

      <EditModal
        item={editing}
        onClose={() => setEditing(null)}
        onSaved={() => load(true)}
      />
    </View>
  );
}

// ── List styles ─────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  screen:     { flex: 1, backgroundColor: BG },
  pageHeader: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4, backgroundColor: BG },
  pageTitle:  { fontSize: 22, fontWeight: '700', color: TEXT },
  pageSub:    { fontSize: 13, color: MUTED, marginTop: 2, marginBottom: 4 },

  summaryRow:     { flexDirection: 'row', backgroundColor: SURFACE, borderRadius: 12, marginTop: 12, marginBottom: 14, borderWidth: 1, borderColor: BORDER, overflow: 'hidden' },
  summaryCard:    { flex: 1, padding: 14 },
  summaryDivider: { width: 1, backgroundColor: BORDER },
  summaryLabel:   { fontSize: 11, color: MUTED, fontWeight: '500', marginBottom: 4 },
  summaryAmount:  { fontSize: 16, fontWeight: '700' },

  filterRow:        { flexDirection: 'row', gap: 8, marginBottom: 12 },
  filterBtn:        { flex: 1, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: BORDER, backgroundColor: SURFACE, alignItems: 'center' },
  filterBtnActive:  { borderColor: GREEN, backgroundColor: '#F1F8F1' },
  filterText:       { fontSize: 13, color: MUTED, fontWeight: '500' },
  filterTextActive: { color: GREEN, fontWeight: '600' },

  countLabel: { fontSize: 12, color: MUTED, marginBottom: 8 },
  list:       { paddingHorizontal: 16, paddingBottom: 32 },

  card:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: SURFACE, borderRadius: 10, marginBottom: 8, paddingHorizontal: 16, paddingVertical: 14, borderWidth: 1, borderColor: BORDER },
  cardLeft:   { flex: 1, marginRight: 12 },
  cardRef:    { fontSize: 13, fontWeight: '600', color: TEXT, marginBottom: 3 },
  cardNote:   { fontSize: 12, color: MUTED, marginBottom: 4 },
  cardDate:   { fontSize: 11, color: MUTED },
  cardRight:  { alignItems: 'flex-end' },
  cardAmount: { fontSize: 14, fontWeight: '700', marginBottom: 3 },
  cardAcct:   { fontSize: 11, color: MUTED },

  empty:      { alignItems: 'center', paddingTop: 60 },
  emptyTitle: { fontSize: 16, fontWeight: '600', color: TEXT },
  emptyNote:  { fontSize: 13, color: MUTED, marginTop: 6 },
  loader:     { flex: 1, alignItems: 'center', justifyContent: 'center' },
});

// ── Detail sheet styles ─────────────────────────────────────────────────────
const d = StyleSheet.create({
  backdrop:    { ...StyleSheet.absoluteFillObject, zIndex: 10 },
  sheet:       { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: SURFACE, borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: Platform.OS === 'ios' ? 0 : 8, maxHeight: '72%', zIndex: 20, borderTopWidth: 1, borderColor: BORDER },
  handle:      { width: 36, height: 4, borderRadius: 2, backgroundColor: BORDER, alignSelf: 'center', marginTop: 12, marginBottom: 4 },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: BORDER },
  sheetType:   { fontSize: 12, color: MUTED, fontWeight: '500', marginBottom: 2 },
  sheetAmount: { fontSize: 26, fontWeight: '700' },
  closeBtn:    { width: 30, height: 30, borderRadius: 15, backgroundColor: MUTED_LIGHT, alignItems: 'center', justifyContent: 'center', marginTop: 4 },
  closeText:   { fontSize: 13, color: MUTED, fontWeight: '600' },
  rowsScroll:  { },
  rowsContent: { paddingHorizontal: 20, paddingTop: 4, paddingBottom: 8 },
  row:         { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingVertical: 11 },
  rowBorder:   { borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  rowLabel:    { fontSize: 13, color: MUTED, flex: 1 },
  rowValue:    { fontSize: 13, color: TEXT, fontWeight: '600', flex: 2, textAlign: 'right' },

  // Action row
  actions:       { flexDirection: 'row', gap: 10, paddingHorizontal: 20, paddingTop: 12, paddingBottom: Platform.OS === 'ios' ? 36 : 20, borderTopWidth: 1, borderTopColor: BORDER },
  editBtn:       { flex: 1, paddingVertical: 13, borderRadius: 10, borderWidth: 1, borderColor: BORDER, alignItems: 'center' },
  editBtnText:   { fontSize: 14, fontWeight: '600', color: TEXT },
  deleteBtn:     { flex: 1, paddingVertical: 13, borderRadius: 10, backgroundColor: '#FFF1F1', borderWidth: 1, borderColor: '#FFCDD2', alignItems: 'center' },
  deleteBtnText: { fontSize: 14, fontWeight: '600', color: RED },
});

// ── Edit modal styles ───────────────────────────────────────────────────────
const e = StyleSheet.create({
  root:   { flex: 1, backgroundColor: BG },
  header: { paddingTop: Platform.OS === 'ios' ? 12 : 16, paddingBottom: 14, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: BORDER, backgroundColor: SURFACE },
  handle: { width: 36, height: 4, borderRadius: 2, backgroundColor: BORDER, alignSelf: 'center', marginBottom: 14 },
  headerRow:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: TEXT },
  headerSub:   { fontSize: 12, color: MUTED, marginTop: 2 },
  closeBtn:    { width: 30, height: 30, borderRadius: 15, backgroundColor: MUTED_LIGHT, alignItems: 'center', justifyContent: 'center' },
  closeX:      { fontSize: 13, color: MUTED, fontWeight: '600' },

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

  inputBase: { backgroundColor: SURFACE, borderRadius: 10, borderWidth: 1, borderColor: BORDER, paddingHorizontal: 14, paddingVertical: 13, fontSize: 15, color: TEXT },
  inputRow:  { flexDirection: 'row', backgroundColor: SURFACE, borderRadius: 10, borderWidth: 1, borderColor: BORDER, alignItems: 'center', overflow: 'hidden' },
  prefix:    { paddingHorizontal: 14, paddingVertical: 13, backgroundColor: MUTED_LIGHT, borderRightWidth: 1, borderRightColor: BORDER },
  prefixText:{ fontSize: 14, fontWeight: '600', color: MUTED },
  inputFlex: { flex: 1, paddingHorizontal: 14, paddingVertical: 13, fontSize: 15, color: TEXT },

  dateTimeRow:      { flexDirection: 'row', backgroundColor: SURFACE, borderRadius: 10, borderWidth: 1, borderColor: BORDER, overflow: 'hidden' },
  dateTimeBtn:      { flex: 1, paddingHorizontal: 14, paddingVertical: 13 },
  dateTimeDivider:  { width: 1, backgroundColor: BORDER },
  dateTimeBtnLabel: { fontSize: 11, color: MUTED, fontWeight: '500', marginBottom: 3 },
  dateTimeBtnValue: { fontSize: 14, fontWeight: '600', color: TEXT },

  textArea: { minHeight: 80, paddingTop: 12 },

  footer:      { flexDirection: 'row', gap: 10, padding: 16, paddingBottom: Platform.OS === 'ios' ? 32 : 16, backgroundColor: SURFACE, borderTopWidth: 1, borderTopColor: BORDER },
  cancelBtn:   { flex: 1, paddingVertical: 14, borderRadius: 10, borderWidth: 1, borderColor: BORDER, alignItems: 'center' },
  cancelText:  { fontSize: 15, fontWeight: '600', color: MUTED },
  saveBtn:     { flex: 2, paddingVertical: 14, borderRadius: 10, backgroundColor: GREEN, alignItems: 'center' },
  saveBtnDim:  { opacity: 0.6 },
  saveText:    { fontSize: 15, fontWeight: '700', color: '#FFF' },
});