"use client";

import { useState } from "react";
import { ArrowPathIcon, CalendarDaysIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { RepositoryFactory } from "@/app/lib/api/repository-factory";
import ConfirmationModal from "../shared/ConfirmationModal";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function LoyaltyAdminTools() {
  const [showBackfillConfirm, setShowBackfillConfirm] = useState(false);
  const [backfillLoading, setBackfillLoading] = useState(false);
  const [backfillDone, setBackfillDone] = useState(false);
  const [backfillError, setBackfillError] = useState("");

  const now = new Date();
  const [creditYear, setCreditYear] = useState(now.getFullYear());
  const [creditMonth, setCreditMonth] = useState(now.getMonth() + 1);
  const [creditsLoading, setCreditsLoading] = useState(false);
  const [creditsDone, setCreditsDone] = useState(false);
  const [creditsError, setCreditsError] = useState("");

  const handleBackfill = async () => {
    setShowBackfillConfirm(false);
    setBackfillLoading(true);
    setBackfillDone(false);
    setBackfillError("");
    try {
      await RepositoryFactory.loyalty.runFullBackfill();
      setBackfillDone(true);
    } catch (err) {
      setBackfillError(err instanceof Error ? err.message : "Backfill failed");
    } finally {
      setBackfillLoading(false);
    }
  };

  const handleRunMonthlyCredits = async () => {
    setCreditsLoading(true);
    setCreditsDone(false);
    setCreditsError("");
    try {
      await RepositoryFactory.loyalty.runMonthlyCredits({ year: creditYear, month: creditMonth });
      setCreditsDone(true);
    } catch (err) {
      setCreditsError(err instanceof Error ? err.message : "Monthly credit run failed");
    } finally {
      setCreditsLoading(false);
    }
  };

  return (
    <div className="grid sm:grid-cols-2 gap-6">
      {/* Full Backfill */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-amber-50 rounded-lg">
            <ArrowPathIcon className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Full Backfill</h3>
            <p className="text-sm text-gray-500 mt-0.5">
              Award points for all past completed orders, reviews, rider ratings, and referrals for
              every customer. Safe to re-run (idempotent).
            </p>
          </div>
        </div>

        {backfillError && (
          <p className="text-sm text-red-600">{backfillError}</p>
        )}

        {backfillDone && (
          <div className="flex items-center gap-2 text-sm text-emerald-600">
            <CheckCircleIcon className="h-4 w-4" />
            Backfill completed successfully.
          </div>
        )}

        <button
          onClick={() => setShowBackfillConfirm(true)}
          disabled={backfillLoading}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-sm font-medium"
        >
          <ArrowPathIcon className={`h-4 w-4 ${backfillLoading ? "animate-spin" : ""}`} />
          {backfillLoading ? "Running Backfill…" : "Run Full Backfill"}
        </button>
      </div>

      {/* Monthly Credits */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <CalendarDaysIcon className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Monthly Credit Run</h3>
            <p className="text-sm text-gray-500 mt-0.5">
              Manually trigger free delivery credit allocation for any past month. The background
              service runs this automatically on the 1st.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Year</label>
            <input
              type="number"
              value={creditYear}
              onChange={(e) => setCreditYear(Number(e.target.value))}
              min={2020}
              max={now.getFullYear()}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Month</label>
            <select
              value={creditMonth}
              onChange={(e) => setCreditMonth(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {MONTHS.map((name, i) => (
                <option key={i + 1} value={i + 1}>{name}</option>
              ))}
            </select>
          </div>
        </div>

        {creditsError && (
          <p className="text-sm text-red-600">{creditsError}</p>
        )}

        {creditsDone && (
          <div className="flex items-center gap-2 text-sm text-emerald-600">
            <CheckCircleIcon className="h-4 w-4" />
            Monthly credits allocated for {creditYear}-{String(creditMonth).padStart(2, "0")}.
          </div>
        )}

        <button
          onClick={handleRunMonthlyCredits}
          disabled={creditsLoading}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-sm font-medium"
        >
          <CalendarDaysIcon className="h-4 w-4" />
          {creditsLoading ? "Running…" : "Run Monthly Credits"}
        </button>
      </div>

      {showBackfillConfirm && (
        <ConfirmationModal
          title="Run Full Backfill?"
          message="This will recalculate loyalty points for every customer based on all historical activity. It may take a while to complete. Safe to run multiple times."
          confirmText="Run Backfill"
          cancelText="Cancel"
          confirmButtonClass="bg-amber-500 hover:bg-amber-600 active:bg-amber-700 focus:ring-amber-500"
          onConfirm={handleBackfill}
          onCancel={() => setShowBackfillConfirm(false)}
        />
      )}
    </div>
  );
}
