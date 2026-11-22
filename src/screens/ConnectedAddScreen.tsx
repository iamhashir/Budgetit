import { useState } from 'react';
import { useConvexAuth, useMutation, useQuery } from 'convex/react';
import { makeFunctionReference } from 'convex/server';

type SavedExpense = { _id: string; amountCents: number; category: string; date: string; note: string };
const listExpenses = makeFunctionReference<'query', Record<string, never>, SavedExpense[]>('expenses:list');
const addExpense = makeFunctionReference<'mutation', { amountCents: number; category: Category; date: string; note: string }, string>('expenses:add');
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { radii, spacing, useDesignSystem } from '../theme';
import { ScreenShell } from './ScreenShell';

const categories = ['Food', 'Transport', 'Shopping', 'Bills', 'Health', 'Other'] as const;
type Category = (typeof categories)[number];

function localDate() {
  const d = new Date();
  return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-');
}

export function ConnectedAddScreen() {
  const { colors } = useDesignSystem();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const expenses = useQuery(listExpenses, isAuthenticated ? {} : 'skip');
  const add = useMutation(addExpense);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>('Food');
  const [date, setDate] = useState(localDate);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function save() {
    const input = amount.trim();
    if (!/^\d+(\\.\d{1,2})?$/.test(input)) {
      setError('Enter a valid amount with up to two decimals.');
      return;
    }
    const amountCents = Math.round(Number(input) * 100);
    if (!Number.isSafeInteger(amountCents) || amountCents <= 0 || amountCents > 100_000_000_000) {
      setError('Enter a valid positive amount.');
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      setError('Enter date as YYYY-MM-DD.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await add({ amountCents, category, date, note: note.trim() });
      setAmount('');
      setNote('');
      Alert.alert('Expense saved', 'Your expense was saved to Convex.');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to save expense.');
    } finally {
      setSaving(false);
    }
  }
  const inputStyle = [styles.input, { color: colors.text, backgroundColor: colors.surfaceGlassStrong, borderColor: colors.border }];
  const labelStyle = [styles.label, { color: colors.text }];

  return (
    <ScreenShell title="Add">
      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
        <Text accessibilityRole="header" style={[styles.heading, { color: colors.text }]}>New expense</Text>
        {!isLoading && !isAuthenticated && (
          <Text style={[styles.notice, { color: colors.mutedText }]}>
            Sign-in is required before expenses can be stored in Convex. Authentication has not been connected yet.
          </Text>
        )}
        <Text style={labelStyle}>Amount</Text>
        <TextInput accessibilityLabel="Expense amount" value={amount} onChangeText={setAmount} keyboardType="decimal-pad" placeholder="0.00" placeholderTextColor={colors.mutedText} style={inputStyle} maxLength={12} />
        <Text style={labelStyle}>Category</Text>
        <View style={styles.categories}>
          {categories.map((item) => (
            <Pressable key={item} accessibilityRole="radio" accessibilityState={{ checked: category === item }} onPress={() => setCategory(item)} style={[styles.chip, { borderColor: category === item ? colors.primary : colors.border, backgroundColor: category === item ? colors.primarySoft : colors.surfaceGlassStrong }]}>
              <Text style={{ color: colors.text, fontWeight: '600' }}>{item}</Text>
            </Pressable>
          ))}
        </View>
        <Text style={labelStyle}>Date</Text>
        <TextInput accessibilityLabel="Expense date" value={date} onChangeText={setDate} style={inputStyle} keyboardType="numbers-and-punctuation" maxLength={10} placeholder="YYYY-MM-DD" placeholderTextColor={colors.mutedText} />
        <Text style={labelStyle}>Note (optional)</Text>
        <TextInput accessibilityLabel="Expense note" value={note} onChangeText={setNote} style={[inputStyle, { minHeight: 90 }]} multiline textAlignVertical="top" maxLength={160} placeholder="What was this for?" placeholderTextColor={colors.mutedText} />
        {error ? <Text accessibilityRole="alert" style={[styles.notice, { color: colors.secondary }]}>{error}</Text> : null}
        <Pressable accessibilityRole="button" accessibilityState={{ disabled: saving || !isAuthenticated }} disabled={saving || !isAuthenticated} onPress={save} style={[styles.button, { opacity: isAuthenticated && !saving ? 1 : 0.5 }]}>
          <LinearGradient colors={colors.bubbleGradient} style={styles.buttonInner}>
            {saving ? <ActivityIndicator color={colors.activeText} /> : <Text style={[styles.buttonText, { color: colors.activeText }]}>Save expense</Text>}
          </LinearGradient>
        </Pressable>
        <View style={[styles.summary, { backgroundColor: colors.surfaceGlassStrong, borderColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.text }]}>Saved expenses</Text>
          {expenses === undefined
            ? <Text style={{ color: colors.mutedText }}>{isAuthenticated ? 'Loading…' : 'Sign in to see your expenses.'}</Text>
            : <>
                <Text style={[styles.total, { color: colors.primary }]}>{(expenses.reduce((sum, item) => sum + item.amountCents, 0) / 100).toFixed(2)}</Text>
                {expenses.map(item => (
                  <View key={item._id} style={[styles.item, { borderTopColor: colors.border }]}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: colors.text, fontWeight: '700' }}>{item.category}</Text>
                      <Text style={{ color: colors.mutedText }}>{item.date}{item.note ? ` · ${item.note}` : ''}</Text>
                    </View>
                    <Text style={{ color: colors.text, fontWeight: '700' }}>{(item.amountCents / 100).toFixed(2)}</Text>
                  </View>
                ))}
              </>}
        </View>
      </ScrollView>
    </ScreenShell>
  );
}
const styles = StyleSheet.create({
  body: { paddingBottom: 140 },
  heading: { fontSize: 25, fontWeight: '800', marginBottom: spacing.lg },
  label: { fontSize: 16, fontWeight: '700', marginBottom: spacing.sm },
  input: { borderWidth: 1, borderRadius: radii.md, minHeight: 56, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, fontSize: 18, marginBottom: spacing.lg },
  categories: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg },
  chip: { borderWidth: 1.5, borderRadius: radii.pill, paddingHorizontal: spacing.md, minHeight: 48, justifyContent: 'center' },
  notice: { fontSize: 14, lineHeight: 21, marginBottom: spacing.md },
  button: { borderRadius: radii.md, overflow: 'hidden' },
  buttonInner: { minHeight: 56, alignItems: 'center', justifyContent: 'center' },
  buttonText: { fontSize: 18, fontWeight: '800' },
  summary: { marginTop: spacing.xl, padding: spacing.md, borderWidth: 1, borderRadius: radii.lg },
  total: { fontSize: 28, fontWeight: '800', marginVertical: spacing.sm },
  item: { paddingVertical: spacing.md, flexDirection: 'row', gap: spacing.md, borderTopWidth: 1 },
});
