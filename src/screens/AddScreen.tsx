import { useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { radii, spacing, useDesignSystem } from '../theme';
import { ScreenShell } from './ScreenShell';

const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Bills', 'Health', 'Other'] as const;
type Category = (typeof CATEGORIES)[number];
type Expense = {
  id: number;
  amount: number;
  category: Category;
  date: string;
  note: string;
};

function todayLocal(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year = 0, month = 0, day = 0] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return (
    year >= 1900 &&
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

export function AddScreen() {
  const { colors } = useDesignSystem();
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>('Food');
  const [date, setDate] = useState(todayLocal);
  const [note, setNote] = useState('');
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [error, setError] = useState('');

  const total = useMemo(
    () => expenses.reduce((sum, expense) => sum + expense.amount, 0),
    [expenses],
  );

  function addExpense() {
    const normalizedAmount = amount.trim();
    if (!/^(?:\d+)(?:\.\d{1,2})?$/.test(normalizedAmount)) {
      setError('Enter a valid amount with up to 2 decimal places.');
      return;
    }
    const numericAmount = Number(normalizedAmount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError('Amount must be greater than zero.');
      return;
    }
    if (!isValidDate(date.trim())) {
      setError('Enter a valid date in YYYY-MM-DD format.');
      return;
    }

    setExpenses((current) => [
      {
        id: Date.now() + current.length,
        amount: numericAmount,
        category,
        date: date.trim(),
        note: note.trim(),
      },
      ...current,
    ]);
    setAmount('');
    setNote('');
    setError('');
    Alert.alert('Added for this session', 'This expense is not yet saved to permanent storage.');
  }

  const inputStyle = [
    styles.input,
    { backgroundColor: colors.surfaceGlassStrong, borderColor: colors.border, color: colors.text },
  ];
  const labelStyle = [styles.label, { color: colors.text }];

  return (
    <ScreenShell title="Add">
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.heading, { color: colors.text }]} accessibilityRole="header">
            New expense
          </Text>
          <Text style={[styles.caption, { color: colors.mutedText }]}>
            Expenses on this page are kept only while the app is running.
          </Text>

          <Text style={labelStyle}>Amount</Text>
          <TextInput
            accessibilityLabel="Expense amount"
            value={amount}
            onChangeText={(value) => {
              setAmount(value);
              setError('');
            }}
            keyboardType="decimal-pad"
            placeholder="0.00"
            placeholderTextColor={colors.mutedText}
            style={inputStyle}
            maxLength={12}
          />

          <Text style={labelStyle}>Category</Text>
          <View style={styles.categoryGrid} accessibilityRole="radiogroup">
            {CATEGORIES.map((item) => {
              const selected = item === category;
              return (
                <Pressable
                  key={item}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: selected }}
                  onPress={() => setCategory(item)}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: selected ? colors.primarySoft : colors.surfaceGlassStrong,
                      borderColor: selected ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <Text style={[styles.chipText, { color: colors.text }]}>{item}</Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={labelStyle}>Date</Text>
          <TextInput
            accessibilityLabel="Expense date in year month day format"
            value={date}
            onChangeText={(value) => {
              setDate(value);
              setError('');
            }}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={colors.mutedText}
            keyboardType="numbers-and-punctuation"
            style={inputStyle}
            maxLength={10}
          />

          <Text style={labelStyle}>Note (optional)</Text>
          <TextInput
            accessibilityLabel="Expense note"
            value={note}
            onChangeText={setNote}
            placeholder="What was this for?"
            placeholderTextColor={colors.mutedText}
            style={[inputStyle, styles.noteInput]}
            maxLength={160}
            multiline
            textAlignVertical="top"
          />

          {error ? (
            <Text accessibilityRole="alert" style={[styles.error, { color: colors.secondary }]}>
              {error}
            </Text>
          ) : null}

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Add expense for this session"
            onPress={addExpense}
            style={styles.saveButton}
          >
            <LinearGradient colors={colors.bubbleGradient} style={styles.saveGradient}>
              <Text style={[styles.saveText, { color: colors.activeText }]}>Add expense</Text>
            </LinearGradient>
          </Pressable>

          <View style={[styles.summary, { backgroundColor: colors.surfaceGlassStrong, borderColor: colors.border }]}>
            <Text style={[styles.summaryHeading, { color: colors.text }]}>
              This session · {expenses.length} {expenses.length === 1 ? 'expense' : 'expenses'}
            </Text>
            <Text style={[styles.total, { color: colors.primary }]}>{total.toFixed(2)}</Text>
            {expenses.slice(0, 5).map((expense) => (
              <View key={expense.id} style={[styles.expenseRow, { borderTopColor: colors.border }]}>
                <View style={styles.flex}>
                  <Text style={[styles.expenseCategory, { color: colors.text }]}>
                    {expense.category}
                  </Text>
                  <Text style={[styles.expenseMeta, { color: colors.mutedText }]} numberOfLines={2}>
                    {expense.date}{expense.note ? ` · ${expense.note}` : ''}
                  </Text>
                </View>
                <Text style={[styles.expenseAmount, { color: colors.text }]}>
                  {expense.amount.toFixed(2)}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scrollContent: { paddingBottom: 140 },
  heading: { fontSize: 25, fontWeight: '800', marginBottom: spacing.sm },
  caption: { fontSize: 14, lineHeight: 21, marginBottom: spacing.lg },
  label: { fontSize: 16, fontWeight: '700', marginBottom: spacing.sm },
  input: {
    borderWidth: 1,
    borderRadius: radii.md,
    minHeight: 56,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 18,
    marginBottom: spacing.lg,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  chip: {
    borderWidth: 1.5,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipText: { fontSize: 15, fontWeight: '600' },
  noteInput: { minHeight: 88, paddingTop: spacing.md },
  error: { fontSize: 14, lineHeight: 20, marginBottom: spacing.md, fontWeight: '600' },
  saveButton: { borderRadius: radii.md, overflow: 'hidden', minHeight: 56 },
  saveGradient: { minHeight: 56, alignItems: 'center', justifyContent: 'center' },
  saveText: { fontSize: 18, fontWeight: '800' },
  summary: {
    borderRadius: radii.lg,
    borderWidth: 1,
    padding: spacing.md,
    marginTop: spacing.xl,
  },
  summaryHeading: { fontSize: 15, fontWeight: '700' },
  total: { fontSize: 28, fontWeight: '800', marginTop: spacing.sm, marginBottom: spacing.sm },
  expenseRow: {
    borderTopWidth: 1,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
  },
  expenseCategory: { fontSize: 16, fontWeight: '700' },
  expenseMeta: { fontSize: 13, lineHeight: 18, marginTop: 3 },
  expenseAmount: { fontSize: 16, fontWeight: '800' },
});
