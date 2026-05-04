import { Text } from "@/components/text";
import {
    EnvelopeIcon,
    IdentificationIcon,
    ShieldCheckIcon,
    KeyIcon
} from "@heroicons/react/24/outline";
import { Card, Chip, Button } from "@heroui/react";

interface UserInfoCardProps {
  id: string;
  username: string;
  email: string;
  role: string;
  candidateRecipientId?: string;
  onChangePasswordClick?: () => void;
}

export default function UserInformation({
  id,
  username,
  email,
  role,
  candidateRecipientId,
  onChangePasswordClick,
}: UserInfoCardProps) {
  return (
    <Card variant="default" className="w-full rounded-2xl shadow-lg">
      <Card.Content className="space-y-4 pb-4">
        {/* Username */}
        <div className="flex items-center gap-2">
          <IdentificationIcon className="h-5 w-5 text-default-500" />
          <Text as="span" size="sm" muted>
            Username:
          </Text>
          <Text as="span" size="sm" weight="medium">
            {username}
          </Text>
        </div>
        {/* User ID */}
        <div className="flex items-center gap-2">
          <IdentificationIcon className="h-5 w-5 text-default-500" />
          <Text as="span" size="sm" muted>
            User ID:
          </Text>
          <Text as="span" size="sm" weight="medium">
            {id}
          </Text>
        </div>

        {/* Email */}
        <div className="flex items-center gap-2">
          <EnvelopeIcon className="h-5 w-5 text-default-500" />
          <Text as="span" size="sm" muted>
            Email:
          </Text>
          <Text as="span" size="sm" weight="medium">
            {email}
          </Text>
        </div>

        {/* Role */}
        <div className="flex items-center gap-2">
          <ShieldCheckIcon className="h-5 w-5 text-default-500" />
          <Text as="span" size="sm" muted>
            Role:
          </Text>
          <Chip
            color={role === "RECIPIENT" ? "success" : "default"}
            variant="soft"
            size="sm"
          >
            <Chip.Label>
              <Text as="span" size="xs" weight="medium">
                {role}
              </Text>
            </Chip.Label>
          </Chip>
        </div>

        {/* Candidate Recipient ID */}
        {candidateRecipientId && (
          <div className="flex items-center gap-2">
            <IdentificationIcon className="h-5 w-5 text-default-500" />
            <Text as="span" size="sm" muted>
              Candidate ID:
            </Text>
            <Text as="span" size="sm" weight="medium">
              {candidateRecipientId}
            </Text>
          </div>
        )}
      </Card.Content>

      {onChangePasswordClick && (
        <Card.Footer className="flex justify-end pt-0">
          <Button
            variant="primary"
            size="sm"
            onPress={onChangePasswordClick}
          >
            <KeyIcon className="h-4 w-4" />
            Ubah Password
          </Button>
        </Card.Footer>
      )}
    </Card>
  );
}
