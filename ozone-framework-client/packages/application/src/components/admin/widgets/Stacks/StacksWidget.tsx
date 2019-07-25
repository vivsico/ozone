import * as React from "react";

import { Button, ButtonGroup, Divider, Intent } from "@blueprintjs/core";

import { stackApi } from "../../../../api/clients/StackAPI";
import { StackDTO } from "../../../../api/models/StackDTO";

import { showConfirmationDialog } from "../../../confirmation-dialog/showConfirmationDialog";
import { ColumnTabulator, GenericTable } from "../../../generic-table/GenericTable";
import { CompactDeleteButton, CompactShareButton, DeleteButton, EditButton } from "../../../generic-table/TableButtons";

import { StackSetup } from "./StackSetup";

import * as styles from "../Widgets.scss";

interface StacksWidgetState {
    stacks: StackDTO[];
    loading: boolean;
    showTable: boolean;
    showStackSetup: boolean;
    updatingStack: StackDTO | undefined;
}
// TODO
// Modify widget to take in widget values from administration menu and launch from menu
// Pagination handling with client API
// Style

enum StackWidgetSubSection {
    TABLE,
    SETUP
}

export class StacksWidget extends React.Component<{}, StacksWidgetState> {
    defaultPageSize: number = 5;

    constructor(props: any) {
        super(props);
        this.state = {
            stacks: [],
            loading: true,
            showTable: true,
            showStackSetup: false,
            updatingStack: undefined
        };

        this.handleUpdate = this.handleUpdate.bind(this);
    }

    componentDidMount() {
        this.getStacks();
    }

    render() {
        const showTable = this.state.showTable;
        const showStackSetup = this.state.showStackSetup;

        return (
            <div data-element-id="stack-admin-widget-dialog">
                {showTable && (
                    <div>
                        <GenericTable
                            title={"Stack Permissions"}
                            items={this.state.stacks}
                            getColumns={() => this.getTableColumns()}
                            tableProps={{
                                loading: this.state.loading,
                                paginationSize: this.defaultPageSize
                            }}
                        />
                    </div>
                )}

                {showStackSetup && (
                    <StackSetup
                        stack={this.state.updatingStack}
                        onUpdate={this.handleUpdate}
                        onBack={async () => {
                            await this.getStacks();
                            this.showSubSection(StackWidgetSubSection.TABLE);
                        }}
                    />
                )}
            </div>
        );
    }

    private showSubSection(subSection: StackWidgetSubSection) {
        this.setState({
            showTable: subSection === StackWidgetSubSection.TABLE,
            showStackSetup: subSection === StackWidgetSubSection.SETUP
        });
    }

    private getStacks = async () => {
        const response = await stackApi.getStacks();

        // TODO: Handle failed request
        if (response.status !== 200) return;

        this.setState({
            stacks: response.data.data,
            loading: false
        });
    };

    private handleUpdate(update?: any) {
        this.getStacks();
    }

    private getTableColumns(): ColumnTabulator[] {
        return [
            { title: "Title", field: "name" },
            { title: "Dashboards", field: "totalDashboards" },
            { title: "Widgets", field: "totalWidgets" },
            { title: "Groups", field: "totalGroups" },
            { title: "Users", field: "totalUsers" },
            {
                title: "Actions",
                width: 150,
                responsive: 0,
                formatter: (row: { cell: { _cell: { row: { data: StackDTO } } } }) => {
                    const data: StackDTO = row.cell._cell.row.data;
                    return (
                        <ButtonGroup data-role="stack-admin-widget-actions" data-dashboardname={data.name}>
                            <CompactShareButton
                                onClick={() => {
                                    this.confirmShare(data);
                                }}
                                itemName={"Share this stack with other users"}
                            />
                            <Divider />
                            <EditButton
                                onClick={() => {
                                    this.setState({ updatingStack: data });
                                    this.showSubSection(StackWidgetSubSection.SETUP);
                                }}
                            />
                            <Divider />
                            <CompactDeleteButton onClick={() => this.confirmDeleteStack(data)} itemName={data.name} />
                        </ButtonGroup>
                    );
                }
            }
        ] as ColumnTabulator[];
    }

    private async confirmShare(stack: StackDTO) {
        showConfirmationDialog({
            title: "Warning",
            message: [
                "You are allowing ",
                { text: stack.name, style: "bold" },
                " to be shared with other users. Press OK to confirm."
            ],
            onConfirm: () => this.onShareConfirmed(stack)
        });
    }

    private async onShareConfirmed(stack: StackDTO) {
        try {
            const response = await stackApi.shareStack(stack.id);
            if (response.status !== 200) return false;
        } catch (e) {
            return false;
        }
        return true;
    }

    private confirmDeleteStack = async (stack: StackDTO) => {
        showConfirmationDialog({
            title: "Warning",
            message: ["This action will permanently delete ", { text: stack.name, style: "bold" }, "."],
            onConfirm: () => this.removeStack(stack)
        });
        return true;
    };

    private removeStack = async (stack: StackDTO) => {
        const response = await stackApi.deleteStackAsAdmin(stack.id);

        // TODO: Handle failed request
        if (response.status !== 200) return false;

        this.getStacks();

        return true;
    };
}
