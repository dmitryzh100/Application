import { Controller, useForm } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';
import { addDays, format, startOfDay } from 'date-fns';

import {
  createEventSchema,
  EventVisibility,
  type CreateEventFormData,
} from '@event-management/shared';

import { resetEventFormData } from '@/modules/events/utils/form.utils';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group';
import { Textarea } from '@/shared/components/ui/textarea';
import { Typography } from '@/shared/components/ui/typography';
import { useFormErrorStyles } from '@/shared/hooks/useFormErrorStyles';

interface EventFormProps {
  onSubmit: (data: CreateEventFormData) => void | Promise<void>;
  defaultValues?: CreateEventFormData;
  submitLabel?: string;
  isSubmitting?: boolean;
  minCapacity?: number;
}

export const EventForm = (props: EventFormProps): React.ReactElement => {
  const {
    onSubmit,
    defaultValues,
    submitLabel = 'Create Event',
    isSubmitting = false,
    minCapacity,
  } = props;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateEventFormData>({
    resolver: yupResolver(createEventSchema),
    defaultValues: defaultValues ?? resetEventFormData(),
  });

  const { getErrorClass } = useFormErrorStyles({ errors });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="relative space-y-2 pb-5">
        <Label htmlFor="title">Event Title *</Label>
        <Input
          id="title"
          placeholder="Enter event title"
          className={getErrorClass('title')}
          {...register('title')}
        />
        {errors.title && (
          <Typography variant="error" className="absolute bottom-0 left-0">
            {errors.title.message}
          </Typography>
        )}
      </div>

      <div className="relative space-y-2 pb-5">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Describe your event"
          rows={4}
          className={getErrorClass('description')}
          {...register('description')}
        />
        {errors.description && (
          <Typography variant="error" className="absolute bottom-0 left-0">
            {errors.description.message}
          </Typography>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="relative space-y-2 pb-5">
          <Label htmlFor="dateTime">Date & Time *</Label>
          <Input
            id="dateTime"
            type="datetime-local"
            min={format(startOfDay(addDays(new Date(), 1)), "yyyy-MM-dd'T'HH:mm")}
            className={getErrorClass('dateTime')}
            {...register('dateTime')}
          />
          {errors.dateTime && (
            <Typography variant="error" className="absolute bottom-0 left-0">
              {errors.dateTime.message}
            </Typography>
          )}
        </div>

        <div className="relative space-y-2 pb-5">
          <Label htmlFor="location">Location *</Label>
          <Input
            id="location"
            placeholder="Event location"
            className={getErrorClass('location')}
            {...register('location')}
          />
          {errors.location && (
            <Typography variant="error" className="absolute bottom-0 left-0">
              {errors.location.message}
            </Typography>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="relative space-y-2 pb-5">
          <Label htmlFor="capacity">Capacity (optional)</Label>
          <Input
            id="capacity"
            type="number"
            min={minCapacity ?? 1}
            placeholder="Leave empty for unlimited"
            className={getErrorClass('capacity')}
            {...register('capacity', {
              validate: (value) => {
                if (minCapacity && value !== null && value !== undefined && value < minCapacity) {
                  return `Capacity cannot be less than ${minCapacity} (current participants)`;
                }

                return true;
              },
            })}
          />
          {errors.capacity && (
            <Typography variant="error" className="absolute bottom-0 left-0">
              {errors.capacity.message}
            </Typography>
          )}
        </div>

        <div className="relative space-y-2 pb-5">
          <Label id="visibility-label">Visibility *</Label>
          <Controller
            name="visibility"
            control={control}
            render={({ field }) => (
              <RadioGroup
                aria-labelledby="visibility-label"
                value={field.value}
                onValueChange={field.onChange}
                className="flex gap-4 pt-2"
              >
                <Label className="flex cursor-pointer items-center gap-2 font-normal">
                  <RadioGroupItem value={EventVisibility.PUBLIC} />
                  Public
                </Label>
                <Label className="flex cursor-pointer items-center gap-2 font-normal">
                  <RadioGroupItem value={EventVisibility.PRIVATE} />
                  Private
                </Label>
              </RadioGroup>
            )}
          />
          {errors.visibility && (
            <Typography variant="error" className="absolute bottom-0 left-0">
              {errors.visibility.message}
            </Typography>
          )}
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : submitLabel}
      </Button>
    </form>
  );
};
