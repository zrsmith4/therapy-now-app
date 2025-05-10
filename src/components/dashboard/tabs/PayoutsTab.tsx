
import React from 'react';

const PayoutsTab: React.FC = () => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Payouts & Stats</h2>
      <p className="text-slate-500 mb-2">
        Here you'll be able to review your pending payouts, stats, and completed sessions.
      </p>
      <div className="mt-4 p-6 rounded bg-medical-light text-center text-slate-700">
        <p><span className="font-semibold">Coming soon!</span></p>
        <p>This section will show payout amounts, past payouts, and session stats when Stripe payouts are connected.</p>
      </div>
    </div>
  );
};

export default PayoutsTab;
