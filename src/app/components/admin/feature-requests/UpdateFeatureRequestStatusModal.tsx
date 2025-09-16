"use client";

import { useState, useEffect } from 'react';
import { Modal, Form, Select, Input, DatePicker, message } from 'antd';
import { FeatureRequestResponseDto, FeatureRequestStatus, UpdateFeatureRequestStatusDto } from '@/app/data/types/feature-request';
import { useUpdateFeatureRequestStatus } from '@/app/lib/hooks/api-hooks.ts/use-feature-request';
import dayjs from 'dayjs';

const { TextArea } = Input;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  featureRequest: FeatureRequestResponseDto | null;
}

export default function UpdateFeatureRequestStatusModal({
  isOpen,
  onClose,
  featureRequest
}: Props) {
  const [form] = Form.useForm();
  const updateStatusMutation = useUpdateFeatureRequestStatus();

  useEffect(() => {
    if (featureRequest && isOpen) {
      form.setFieldsValue({
        status: featureRequest.status,
        reviewNotes: featureRequest.reviewNotes || '',
        estimatedImplementationDate: featureRequest.estimatedImplementationDate 
          ? dayjs(featureRequest.estimatedImplementationDate) 
          : null
      });
    }
  }, [featureRequest, isOpen, form]);

  const handleSubmit = async (values: any) => {
    if (!featureRequest) return;

    try {
      const updateData: UpdateFeatureRequestStatusDto = {
        status: values.status,
        reviewNotes: values.reviewNotes,
        estimatedImplementationDate: values.estimatedImplementationDate?.format('YYYY-MM-DD')
      };

      await updateStatusMutation.mutateAsync({
        id: featureRequest.id,
        data: updateData
      });

      message.success('Feature request status updated successfully');
      form.resetFields();
      onClose();
    } catch (error) {
      message.error('Failed to update feature request status');
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  const statusOptions = Object.values(FeatureRequestStatus).map(status => ({
    label: status,
    value: status,
  }));

  return (
    <Modal
      title="Update Feature Request Status"
      open={isOpen}
      onOk={() => form.submit()}
      onCancel={handleCancel}
      confirmLoading={updateStatusMutation.isPending}
      width={600}
      destroyOnClose
    >
      {featureRequest && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2">{featureRequest.title}</h4>
          <p className="text-gray-600 text-sm mb-2">{featureRequest.description}</p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>Category: {featureRequest.category.replace(/([A-Z])/g, ' $1').trim()}</span>
            <span>Priority: {featureRequest.priority}</span>
            <span>Submitted: {new Date(featureRequest.submittedAt).toLocaleDateString()}</span>
          </div>
        </div>
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        requiredMark={false}
      >
        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: 'Please select a status' }]}
        >
          <Select
            placeholder="Select status"
            options={statusOptions}
          />
        </Form.Item>

        <Form.Item
          name="reviewNotes"
          label="Review Notes"
          help="Add any notes about this status change"
        >
          <TextArea
            placeholder="Enter review notes..."
            rows={4}
            maxLength={1000}
            showCount
          />
        </Form.Item>

        <Form.Item
          name="estimatedImplementationDate"
          label="Estimated Implementation Date"
          help="When do you expect this feature to be implemented? (Optional)"
        >
          <DatePicker
            className="w-full"
            placeholder="Select estimated implementation date"
            disabledDate={(current) => current && current < dayjs().startOf('day')}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}