import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ActivityIndicator, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

export default function MarketplaceTextPartSearchResults({ query, isLoading, error, result }) {
  const { colors } = useTheme();
  if (!query) return null;
  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <MaterialCommunityIcons name="store-search-outline" size={21} color={colors.accent} />
          <Text style={[styles.title, { color: colors.text }]}>Part search results</Text>
        </View>
        <Text style={[styles.query, { color: colors.secondaryText }]} numberOfLines={2}>{query}</Text>
      </View>
      {isLoading ? (
        <View style={[styles.stateCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <ActivityIndicator color={colors.accent} />
          <Text style={[styles.stateText, { color: colors.secondaryText }]}>Searching nearby and online listings…</Text>
        </View>
      ) : error ? (
        <View style={[styles.stateCard, { backgroundColor: colors.card, borderColor: colors.danger }]}>
          <MaterialCommunityIcons name="alert-circle-outline" size={22} color={colors.danger} />
          <Text style={[styles.stateText, { color: colors.danger }]}>{error}</Text>
        </View>
      ) : result ? (
        <>
          <Text style={[styles.message, { color: colors.secondaryText }]}>{result.message}</Text>
          <Text style={[styles.historyStatus, { color: result.historySaved ? colors.secondaryText : colors.danger }]}>{result.historySaved ? 'Search saved to your MechanIQ account.' : 'Results loaded, but this search could not be saved to your account.'}</Text>
          {result.offers?.length ? result.offers.map((offer, index) => {
            const beginsGroup = index === 0 || result.offers[index - 1].sourceType !== offer.sourceType;
            return (
              <View key={`${offer.id || offer.productName}-${index}`}>
                {beginsGroup ? <Text style={[styles.groupTitle, { color: colors.text }]}>{offer.sourceType === 'nearby' ? 'Nearby shops' : 'Online offers'}</Text> : null}
                <TouchableOpacity activeOpacity={0.75} disabled={!offer.productUrl} onPress={() => { if (offer.productUrl) Linking.openURL(offer.productUrl).catch(() => {}); }} style={[styles.offerCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <View style={[styles.offerIcon, { backgroundColor: colors.background }]}>
                    <MaterialCommunityIcons name={offer.sourceType === 'nearby' ? 'store-marker-outline' : 'web'} size={22} color={colors.accent} />
                  </View>
                  <View style={styles.offerContent}>
                    <Text numberOfLines={2} style={[styles.offerName, { color: colors.text }]}>{offer.productName}</Text>
                    <Text numberOfLines={1} style={[styles.offerRetailer, { color: colors.secondaryText }]}>{offer.sourceType === 'nearby' ? 'Nearby' : 'Online'} · {offer.retailer}</Text>
                    <Text style={[styles.offerPrice, { color: colors.accent }]}>{offer.priceText || 'Price unavailable'}</Text>
                    {offer.recommendation ? <Text style={[styles.offerDetail, { color: colors.secondaryText }]}>{offer.recommendation}</Text> : null}
                    {offer.delivery ? <Text style={[styles.offerDetail, { color: colors.secondaryText }]}>{offer.sourceType === 'nearby' ? 'Location: ' : 'Delivery: '}{offer.delivery}</Text> : null}
                    {offer.rating ? <Text style={[styles.offerDetail, { color: colors.secondaryText }]}>★ {offer.rating}{offer.reviewCount ? ` (${offer.reviewCount} reviews)` : ''}</Text> : null}
                  </View>
                  {offer.productUrl ? <Ionicons name="open-outline" size={19} color={colors.accent} /> : null}
                </TouchableOpacity>
              </View>
            );
          }) : (
            <View style={[styles.stateCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <MaterialCommunityIcons name="magnify-close" size={26} color={colors.secondaryText} />
              <Text style={[styles.stateText, { color: colors.secondaryText }]}>No nearby shops or online listings found. Try a more specific part name or OEM number.</Text>
            </View>
          )}
          <Text style={[styles.disclaimer, { color: colors.secondaryText }]}>Listings and text matches do not verify fitment or live stock. Confirm the OEM number, compatibility, price, and availability with the seller before buying.</Text>
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginTop: 16 }, header: { marginBottom: 8 }, titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { fontSize: 16, fontWeight: '800' }, query: { fontSize: 11, marginTop: 4 }, message: { fontSize: 11, lineHeight: 16, marginBottom: 8 },
  groupTitle: { fontSize: 12, fontWeight: '800', marginTop: 8, marginBottom: 6 }, offerCard: { minHeight: 92, borderWidth: 1, borderRadius: 13, padding: 10, marginBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 10 },
  offerIcon: { width: 42, height: 42, borderRadius: 11, alignItems: 'center', justifyContent: 'center' }, offerContent: { flex: 1, minWidth: 0 }, offerName: { fontSize: 12, fontWeight: '800' },
  offerRetailer: { fontSize: 10, marginTop: 3 }, offerPrice: { fontSize: 13, fontWeight: '800', marginTop: 4 }, offerDetail: { fontSize: 9, lineHeight: 13, marginTop: 3 },
  stateCard: { minHeight: 82, borderWidth: 1, borderRadius: 13, padding: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }, stateText: { flex: 1, fontSize: 11, lineHeight: 16 },
  disclaimer: { fontSize: 9, lineHeight: 14, marginTop: 7 }, historyStatus: { fontSize: 10, marginBottom: 6 },
});
