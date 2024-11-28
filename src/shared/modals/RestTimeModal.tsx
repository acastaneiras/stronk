import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { TimePickerInput } from '@/components/ui/time-picker-input';
import { ResponsiveModal } from '@/shared/modals/ResponsiveModal';
import dayjs from 'dayjs';
import { RotateCcw } from 'lucide-react';
import { useRef, useState } from 'react';

type RestTimeModalProps = {
  showRestTime: boolean;
  setShowRestTime: (value: boolean) => void;
  handleSaveRestTime: (seconds: number) => void;
}

const RestTimeModal = ({ showRestTime, setShowRestTime, handleSaveRestTime }: RestTimeModalProps) => {
  const [date, setDate] = useState<Date | undefined>(new Date(0));

  const minuteRef = useRef<HTMLInputElement>(null);
  const secondRef = useRef<HTMLInputElement>(null);
  const handleCancel = () => {
    setShowRestTime(false);
  };

  return (
    <ResponsiveModal
      open={showRestTime}
      onOpenChange={setShowRestTime}
      dismissable={true}
      title="Set Rest Time"
      titleClassName="text-lg font-semibold leading-none tracking-tight"
      footer={
        <>
          <Button
            onClick={() => handleSaveRestTime(dayjs(date).minute() * 60 + dayjs(date).second())}
          > Save
          </Button>
          <Button variant='outline' onClick={handleCancel}>
            Cancel
          </Button>
        </>
      }
    >
      <div className='flex flex-col gap-2'>
        <div className="flex items-end justify-center gap-2">
          <div className="grid gap-1 text-center">
            <Label htmlFor="minutes" className="text-xs">
              Minutes
            </Label>
            <TimePickerInput
              picker="minutes"
              date={date}
              setDate={setDate}
              ref={minuteRef}
              onRightFocus={() => secondRef.current?.focus()}
            />
          </div>
          <div className="grid gap-1 text-center">
            <Label htmlFor="seconds" className="text-xs">
              Seconds
            </Label>
            <TimePickerInput
              picker="seconds"
              date={date}
              setDate={setDate}
              ref={secondRef}
              onLeftFocus={() => minuteRef.current?.focus()}
            />
          </div>
        </div>
        <div className='grid gap-1 text-center justify-center'>
          <Button variant={`outline`} onClick={() => setDate(new Date(0))}><RotateCcw /> Reset</Button>
        </div>
      </div>
    </ResponsiveModal>
  )
}

export default RestTimeModal