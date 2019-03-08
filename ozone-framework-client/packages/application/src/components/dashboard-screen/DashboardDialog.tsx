import * as React from "react";
import { useEffect, useState } from "react";
import { useBehavior } from "../../hooks";

import { Button, ButtonGroup, Card, Classes, Dialog, Divider, Intent } from "@blueprintjs/core";

import { mainStore } from "../../stores/MainStore";
import { errorStore } from "../../services/ErrorStore";

import { dashboardApi } from "../../api/clients/DashboardAPI";
import { DashboardDTO } from "../../api/models/DashboardDTO";
import { ConfirmationDialog } from "../confirmation-dialog/ConfirmationDialog";
import { EditDashboardForm } from "../create-dashboard-screen/EditDashboardForm";

// TODO - convert to edit stacks
// TODO - iconImageUrl not saving to database - clientAPI
// TODO - style image

const fetchDashboards = (dispatchResult: (dashboards: DashboardDTO[]) => void) => {
    dashboardApi.getDashboards().then((response) => {
        if (response.status !== 200) return;

        dispatchResult(response.data.data);
    });
};

export const DashboardDialog: React.FunctionComponent<{}> = () => {
    const themeClass = useBehavior(mainStore.themeClass);
    const isVisible = useBehavior(mainStore.isDashboardDialogVisible);

    const [showDelete, setDelete] = useState(false);
    const [showEdit, setEdit] = useState(false);
    const [currentDashboard, setCurrentDashboard] = useState<DashboardDTO | null>(null);
    const [confirmationMessage, setConfirmationMessage] = useState("");
    const [dashboards, setDashboards] = useState<DashboardDTO[]>([]);

    // Fetch the Dashboards when isVisible changes to `true`
    useEffect(() => {
        if (isVisible) fetchDashboards(setDashboards);
    }, [isVisible]);

    const showEditDialog = async (dashboard: DashboardDTO) => {
        setEdit(true);
        setCurrentDashboard(dashboard);
    };

    const onEditSubmitted = () => {
        setEdit(false);
        fetchDashboards(setDashboards);
        return true;
    };

    const showDeleteConfirmation = async (dashboard: DashboardDTO) => {
        setDelete(true);
        setConfirmationMessage(`This action will permanently delete <strong>${dashboard.name}</strong>`);
        setCurrentDashboard(dashboard);
    };

    const onDeleteConfirmed = async () => {
        if (currentDashboard === null) {
            errorStore.warning("Assertion Error", "DashboardDialog: expected currentDashboard to not be null");
            return false;
        }

        const response = await dashboardApi.deleteDashboard(currentDashboard.guid);
        if (response.status !== 200) return false;

        setDelete(false);
        setCurrentDashboard(null);
        setConfirmationMessage("");

        fetchDashboards(setDashboards);

        return true;
    };

    const onDeleteCancelled = () => {
        setDelete(false);
        setCurrentDashboard(null);
    };

    return (
        <div>
            {showDelete && (
                <ConfirmationDialog
                    show={showDelete}
                    title={"Warning"}
                    content={confirmationMessage}
                    confirmHandler={onDeleteConfirmed}
                    cancelHandler={onDeleteCancelled}
                    payload={currentDashboard}
                />
            )}

            {!showEdit ? (
                <Dialog
                    className={themeClass}
                    isOpen={isVisible}
                    onClose={mainStore.hideDashboardDialog}
                    title="Dashboards"
                >
                    <div className={Classes.DIALOG_BODY} data-element-id={"dashboard-dialog"}>
                        {dashboards.map((dashboard) => (
                            <Card key={dashboard.guid}>
                                <h4>{dashboard.name}</h4>
                                <p>{dashboard.description}</p>
                                <img src={dashboard.iconImageUrl}/>
                                <ButtonGroup>
                                    <Button
                                        key={dashboard.guid}
                                        value={dashboard.name}
                                        icon="edit"
                                        text="Edit"
                                        data-element-id={"dashboard-edit-button-" + dashboard.name}
                                        onClick={() => showEditDialog(dashboard)}
                                    />
                                    <Divider/>
                                    <Button
                                        data-element-id={"dashboard-delete-button-" + dashboard.name}
                                        text="Delete"
                                        intent={Intent.DANGER}
                                        icon="trash"
                                        onClick={() => showDeleteConfirmation(dashboard)}
                                    />
                                </ButtonGroup>
                            </Card>
                        ))}
                    </div>

                    <div className={Classes.DIALOG_FOOTER}>
                        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                            <Button
                                onClick={() => {
                                    mainStore.hideDashboardDialog();
                                    mainStore.showCreateDashboardDialog();
                                }}
                                icon="insert"
                                data-element-id="dashboard-create-button"
                            >
                                Create New
                            </Button>
                        </div>
                    </div>
                </Dialog>
            ) : (
                <Dialog className={themeClass} isOpen={showEdit} onClose={() => setEdit(false)} title="Edit Dashboard">
                    <div data-element-id="EditDashboardDialog" className={Classes.DIALOG_BODY}>
                        <EditDashboardForm dashboard={currentDashboard} onSubmit={onEditSubmitted}/>
                    </div>

                    <div className={Classes.DIALOG_FOOTER}>
                        <div className={Classes.DIALOG_FOOTER_ACTIONS}/>
                    </div>
                </Dialog>
            )}
        </div>
    );
};
