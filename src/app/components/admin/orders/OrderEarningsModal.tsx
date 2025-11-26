"use client";

import { useState, useEffect } from "react";
import { message } from "antd";
import { EarningsRepository } from "@/app/lib/api/repositories/earnings-repository";
import { OrderEarningsDto } from "@/app/data/types/earnings";
import EarningsDetailsModal from "../earnings/EarningsDetailsModal";

interface OrderEarningsModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
}

export default function OrderEarningsModal({ isOpen, onClose, orderId }: OrderEarningsModalProps) {
  const [earning, setEarning] = useState<OrderEarningsDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const earningsRepository = new EarningsRepository();

  useEffect(() => {
    if (isOpen && orderId) {
      fetchEarnings();
    }
  }, [isOpen, orderId]);

  const fetchEarnings = async () => {
    setIsLoading(true);
    try {
      const data = await earningsRepository.getOrderEarningByOrderId(orderId);
      setEarning(data);
    } catch (error) {
      console.error("Error fetching order earnings:", error);
      message.error("Failed to load earnings details");
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <>
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Loading Modal */}
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="bg-surface-0 rounded-card shadow-soft-lg p-8 border border-border-light">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm text-text-secondary">Loading earnings details...</span>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <EarningsDetailsModal
      isOpen={isOpen && !!earning}
      onClose={onClose}
      earning={earning}
    />
  );
}
