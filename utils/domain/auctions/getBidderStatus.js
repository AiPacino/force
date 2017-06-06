import get from 'lodash.get'

export function getBidderStatus (me, auction) {
  const foundQualifiedForBiddingKey = get(me, 'bidders.0', {}).hasOwnProperty('qualified_for_bidding')

  if (auction.is_registration_closed) {
    return 'registration-closed'

    /**
     * Due to falsy behavior we need to check for the existence of a
     * qualified_for_bidding key and then check its value. This handles conditions
     * where we want to display the "Bid Now" button, but only to trigger a
     * login modal or redirect to register transition for the user.
     */
  } else if (foundQualifiedForBiddingKey) {
    const isQualified = get(me, 'bidders.0.qualified_for_bidding')

    if (isQualified) {
      return 'qualified-to-bid'
    } else {
      return 'registration-pending'
    }
  } else if (me && auction.require_bidder_approval) {
    return 'registration-required'
  } else if (me) {
    return 'logged-in'
  } else {
    return 'logged-out'
  }
}