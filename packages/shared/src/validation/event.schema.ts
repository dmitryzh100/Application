import * as yup from 'yup';

import { EventVisibility } from '../types/event.types';

function isTomorrowOrLater(value: string | undefined): boolean {
  if (!value) return true;

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  return new Date(value) >= tomorrow;
}

const titleField = yup.string().min(3, 'Title must be at least 3 characters');
const descriptionField = yup.string().default('');
const dateTimeField = yup
  .string()
  .test('is-tomorrow-or-later', 'Event date must be at least tomorrow', isTomorrowOrLater);
const locationField = yup.string();
const capacityField = yup
  .number()
  .nullable()
  .transform((value, original) => (original === '' || original === undefined ? null : value))
  .min(1, 'Capacity must be at least 1');
const visibilityField = yup.string().oneOf(Object.values(EventVisibility), 'Invalid visibility');

const baseEventSchema = yup.object({
  title: titleField,
  description: descriptionField,
  dateTime: dateTimeField,
  location: locationField,
  capacity: capacityField,
  visibility: visibilityField,
});

export const createEventSchema = baseEventSchema.shape({
  title: titleField.required('Title is required'),
  dateTime: dateTimeField.required('Date and time is required'),
  location: locationField.required('Location is required'),
  visibility: visibilityField.required('Visibility is required'),
});

export const updateEventSchema = baseEventSchema;

export type CreateEventFormData = yup.InferType<typeof createEventSchema>;
export type UpdateEventFormData = yup.InferType<typeof updateEventSchema>;
