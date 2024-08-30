import { useState } from "react";
import { api } from "~/trpc/react";
import { Badge } from "~/app/_components/ui/badge";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/app/_components/ui/accordion";
import { Switch } from "~/app/_components/ui/switch";

export function Permissions({ id }: { id: string }): JSX.Element {
  const { data } = api.spaces.fetch.useQuery({ id });
  const { data: roles } = api.colony.roles.useQuery({ id });

  const [switchStates, setSwitchStates] = useState<{ [key: string]: boolean }>(
    {},
  );

  const handleSwitchChange = (
    roleId: string,
    switchId: string,
    value: boolean,
  ) => {
    setSwitchStates((prevState) => ({
      ...prevState,
      [`${roleId}-${switchId}`]: value,
    }));
  };

  const formatMemberCount = (count: number): string => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + "M";
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + "K";
    }
    return count.toString();
  };

  return (
    <>
      {roles?.data.map((role: any) => (
        <AccordionItem
          key={role.id}
          value={role.id}
          className={`${role.name == "Guest" ? "hidden" : ""}`}
        >
          <AccordionTrigger>
            <div className="flex items-center">
              {role.name}
              <span className="member-count-bubble ml-2">
                {formatMemberCount(role.memberCount)}
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="ml-2">
            <div className="mb-3">
              <div className="flex items-center justify-between space-x-2">
                <div>
                  <span>View Workspace</span>
                  <p className="mt-1 text-xs font-normal text-black dark:text-zinc-300">
                    Allows members to view the {data?.name} workspace.
                  </p>
                </div>
                <Switch
                  id={`${role.id}-view-workspace`}
                  checked={
                    switchStates[`${role.id}-manage-workspace`] ||
                    (role.rank == 255 ? true : false)
                  }
                  onClick={(e) =>
                    handleSwitchChange(
                      role.id,
                      "view-workspace",
                      !switchStates[`${role.id}-view-workspace`],
                    )
                  }
                />
              </div>
            </div>
            <div className="mb-3">
              <div className="flex items-center justify-between space-x-2">
                <div>
                  <span>Manage Workspace</span>
                  <p className="mt-1 text-xs font-normal text-black dark:text-zinc-300">
                    Allows members to manage the {data?.name} workspace.
                  </p>
                </div>
                <Switch
                  id={`${role.id}-manage-workspace`}
                  checked={
                    switchStates[`${role.id}-manage-workspace`] ||
                    (role.rank == 255 ? true : false)
                  }
                  onClick={(e) =>
                    handleSwitchChange(
                      role.id,
                      "manage-workspace",
                      !switchStates[`${role.id}-manage-workspace`],
                    )
                  }
                />
              </div>
            </div>
            <div className="mb-3">
              <div className="flex items-center justify-between space-x-2">
                <div>
                  <span>Workspace Administrator</span>
                  <p className="mt-1 text-xs font-normal text-black dark:text-zinc-300">
                    Members with this permission will have every permission
                    within the workspace.{" "}
                    <b>This is a dangerous permission to grant.</b>
                  </p>
                </div>
                <Switch
                  id={`${role.id}-admin-workspace`}
                  checked={
                    switchStates[`${role.id}-admin-workspace`] ||
                    (role.rank === 255 ? true : false)
                  }
                  onClick={(e) =>
                    handleSwitchChange(
                      role.id,
                      "admin-workspace",
                      !switchStates[`${role.id}-admin-workspace`],
                    )
                  }
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </>
  );
}
