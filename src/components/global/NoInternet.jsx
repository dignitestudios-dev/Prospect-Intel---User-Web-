import { WifiOff } from "lucide-react";
import Dialog from "../../ui/Dialog";
import Button from "../../ui/Button";
import EmptyState from "../../ui/EmptyState";

const NoInternetModal = ({ isOpen }) => {
  return (
    <Dialog open={isOpen} dismissible={false} size="sm" onClose={() => {}}>
      <EmptyState
        icon={WifiOff}
        title="You're offline"
        className="py-6"
        action={
          <Button variant="dark" onClick={() => window.location.reload()}>
            Reload page
          </Button>
        }
      >
        Check your connection, then reload to pick up where you left off.
      </EmptyState>
    </Dialog>
  );
};

export default NoInternetModal;
