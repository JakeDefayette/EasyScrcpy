import { useDeviceStore } from "../stores/deviceStore";
import { DeviceCard } from "./DeviceCard";
import { EmptyState } from "./EmptyState";

export function DeviceList() {
  const { devices, isLoading, error } = useDeviceStore();

  if (devices.length === 0) {
    return <EmptyState isLoading={isLoading} error={error} />;
  }

  return (
    <div className="space-y-2">
      {devices.map((device) => (
        <DeviceCard key={device.serial} device={device} />
      ))}
    </div>
  );
}
