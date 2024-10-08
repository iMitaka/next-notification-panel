import React, { useCallback, useMemo } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Select from "@radix-ui/react-select";
import { useForm, Controller, useWatch } from "react-hook-form";
import { NotificationType } from "@/contracts/notification"; // Adjust the import path as necessary

export interface NotificationFormData {
  type: NotificationType;
  releaseNumber?: string;
  personName?: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: NotificationFormData) => void;
}

export const CreateNotificationModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<NotificationFormData>();
  
  const notificationType = useWatch({ control, name: "type" });

  const onSubmitForm = useCallback(
    (data: NotificationFormData) => {
      onSubmit(data);
    },
    [onSubmit]
  );

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [onClose, reset]);

  const notificationTypesOptions = useMemo(
    () =>
      Object.values(NotificationType).map((type) => (
        <Select.Item
          key={type}
          value={type}
          className="px-3 py-2 cursor-pointer hover:bg-gray-100 w-full"
        >
          <Select.ItemText>{type}</Select.ItemText>
        </Select.Item>
      )),
    []
  );

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleClose}>
      <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 z-50" />
      <Dialog.Content className="fixed inset-0 flex justify-center items-center z-50 p-4">
        <div className="bg-white p-4 rounded-md shadow-lg w-full max-w-md">
          <Dialog.Title className="text-xl font-bold mb-4">
            Create Notification
          </Dialog.Title>
          <form onSubmit={handleSubmit(onSubmitForm)}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notification Type
              </label>
              <Controller
                name="type"
                control={control}
                defaultValue={NotificationType.PlatformUpdate}
                render={({ field }) => (
                  <Select.Root onValueChange={field.onChange}>
                    <Select.Trigger className="inline-flex items-center justify-between w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm">
                      <Select.Value placeholder="Select a type" />
                      <Select.Icon />
                    </Select.Trigger>
                    <Select.Content className="bg-white border border-gray-300 rounded-md shadow-lg w-full">
                      <Select.ScrollUpButton />
                      <Select.Viewport>
                        {notificationTypesOptions}
                      </Select.Viewport>
                      <Select.ScrollDownButton />
                    </Select.Content>
                  </Select.Root>
                )}
              />
            </div>
            {notificationType === NotificationType.PlatformUpdate ? (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Release Number
                </label>
                <Controller
                  name="releaseNumber"
                  control={control}
                  rules={{
                    required: "Release Number is required",
                    pattern: {
                      value: /^\d+\.\d+\.\d+$/,
                      message: "Release Number must be in the format x.x.x",
                    },
                  }}
                  render={({ field }) => (
                    <input
                      type="text"
                      {...field}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    />
                  )}
                />
                {errors.releaseNumber && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.releaseNumber.message}
                  </p>
                )}
              </div>
            ) : (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Person Name
                </label>
                <Controller
                  name="personName"
                  control={control}
                  rules={{
                    required: "Person Name is required",
                    minLength: {
                      value: 3,
                      message: "Person Name must be at least 3 characters long",
                    },
                  }}
                  render={({ field }) => (
                    <input
                      type="text"
                      {...field}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    />
                  )}
                />
                {errors.personName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.personName.message}
                  </p>
                )}
              </div>
            )}
            <div className="flex justify-end space-x-2">
              <Dialog.Close asChild>
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded-md"
                  onClick={handleClose}
                >
                  Close
                </button>
              </Dialog.Close>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
};
