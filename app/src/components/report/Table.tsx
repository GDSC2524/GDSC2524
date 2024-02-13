import React, { useState, useCallback, useMemo } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import CheckIcon from '@mui/icons-material/Check';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { Collapse, IconButton, Chip, ChipProps } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import { NoResultsOverlay, CustomToolbar } from './TableUIHelpers';
import { SelectChangeEvent } from '@mui/material/Select';
import { IReport } from '@/models';
import { useReports } from '@/hooks/report/useReports';
import ButtonLink from '../ButtonLink';
import Box from '@mui/material/Box';
import { StatusOfReport, ReportCategories, ReportFields } from '@/models';
import {
    DataGrid,
    GridRowsProp,
    GridColDef,
    GridActionsCellItem,
    GridRowParams,
    GridRenderCellParams,
    GridFilterItem,
    GridFilterModel,
    getGridSingleSelectOperators,
} from '@mui/x-data-grid';

const EXPANDED_ROW_STYLE = {
    whiteSpace: 'pre-wrap',
    overflowWrap: 'break-word',
    paddingBottom: '10px',
};

const columnWidth = {
    reportId: 63,
    name: 230,
    reportCategory: 379,
    address: 200,
    dateTimeOfSubmission: 126,
    statusOfReport: 126,
    actions: 170,
};

function getChipProps(params: GridRenderCellParams): ChipProps {
    const status = params.value;
    switch (status) {
        case StatusOfReport.Submitted:
            return {
                icon: <InfoIcon color="primary" />,
                label: status,
                color: 'primary',
            };
        case StatusOfReport.In_Progress:
            return {
                icon: <AutorenewIcon color="warning" />,
                label: status,
                color: 'warning',
            };
        case StatusOfReport.Completed:
            return {
                icon: <CheckIcon color="success" />,
                label: status,
                color: 'success',
            };
        case StatusOfReport.On_Hold:
            return {
                icon: <PauseCircleIcon color="secondary" />,
                label: status,
                color: 'secondary',
            };
        case StatusOfReport.Rejected:
            return {
                icon: <WarningIcon color="error" />,
                label: status,
                color: 'error',
            };
        default:
            return {
                icon: <QuestionMarkIcon style={{ fill: 'orange' }} />,
                label: 'Invalid',
                style: {
                    borderColor: 'orange',
                },
            };
    }
}

export default function Table() {
    const [clickedIndex, setClickedIndex] = useState<string | null>(null);
    const [queryOptions, setQueryOptions] = useState<GridFilterItem[]>([]);
    const [sortOptions, setSortOptions] = useState<boolean | undefined>(undefined);

    const hasFilter = queryOptions.length > 0 && queryOptions[0].value !== undefined;

    //Fetch the updated filter settings, then pass the settings to the backend
    const onFilterChange = useCallback((filterModel: GridFilterModel) => {
        setQueryOptions([...filterModel.items]);
        setSortOptions(undefined);
    }, []);

    const onSortChange = useCallback((event: SelectChangeEvent) => {
        switch (event.target.value) {
            case 'true':
                setSortOptions(true);
                return;
            case 'false':
                setSortOptions(false);
                return;
            default:
                setSortOptions(undefined);
                return;
        }
    }, []);

    const { reports, isLoading, loadReports, refreshReports } = useReports(
        queryOptions,
        sortOptions
    );

    const isEmpty = useMemo<boolean>(
        () => !isLoading && reports?.length === 0,
        [isLoading, reports]
    );

    const columns: GridColDef[] = [
        {
            field: ReportFields.Report_Id,
            headerName: '',
            filterable: false,
            sortable: false,
            width: columnWidth.reportId,
            renderCell: (cellValues: GridRenderCellParams<any>) => {
                return (
                    <IconButton
                        aria-label={
                            cellValues.row.reportId === clickedIndex ? 'Collapse row' : 'Expand row'
                        }
                        onClick={() => {
                            clickedIndex === cellValues.row.reportId
                                ? setClickedIndex(null)
                                : setClickedIndex(cellValues.row.reportId);
                        }}
                    >
                        {cellValues.row.reportId === clickedIndex ? (
                            <ExpandLessIcon />
                        ) : (
                            <ExpandMoreIcon />
                        )}
                    </IconButton>
                );
            },
        },
        {
            field: ReportFields.Name,
            headerName: 'Name',
            filterable: false,
            width: columnWidth.name,
            renderCell: (cellValues: GridRenderCellParams<any>) => {
                return (
                    <Box>
                        <div>
                            {/* First row item, ex: the name will be displayed here */}
                            {cellValues.value ? cellValues.value : 'Anonymous'}
                            <Collapse
                                in={cellValues.row.reportId === clickedIndex}
                                aria-expanded={cellValues.row.reportId === clickedIndex}
                            >
                                <Box sx={EXPANDED_ROW_STYLE}>
                                    {/* Expanded row item */}
                                    {cellValues.row.phoneNumber}
                                    <br />
                                    {cellValues.row.emailAddress}
                                </Box>
                            </Collapse>
                        </div>
                    </Box>
                );
            },
        },
        {
            field: ReportFields.Report_Category,
            headerName: 'Issues',
            type: 'singleSelect',
            //TODO: update the valueOptions to match the options in creationPage
            valueOptions: Object.values(ReportCategories),
            width: columnWidth.reportCategory,
            filterOperators: getGridSingleSelectOperators().filter(
                (operator) => operator.value === 'is'
            ),
            renderCell: (cellValues: GridRenderCellParams<any>) => {
                return (
                    <Box>
                        <div>
                            {/* First row item */}
                            {cellValues.value}
                            <Collapse
                                in={cellValues.row.reportId === clickedIndex}
                                aria-expanded={cellValues.row.reportId === clickedIndex}
                            >
                                <Box sx={EXPANDED_ROW_STYLE}>
                                    {/* Expanded row item */}
                                    {cellValues.row.issueDescription.length > 50
                                        ? cellValues.row.issueDescription.substring(0, 50)
                                        : cellValues.row.issueDescription}
                                </Box>
                            </Collapse>
                        </div>
                    </Box>
                );
            },
        },
        {
            field: ReportFields.Address,
            headerName: 'Location',
            filterable: false,
            width: columnWidth.address,
        },
        {
            field: ReportFields.Date_Time_Of_Submission,
            headerName: 'Date Reported',
            filterable: false,
            type: 'date',
            valueGetter: ({ value }) => value && new Date(value),
            width: columnWidth.dateTimeOfSubmission,
        },
        {
            field: ReportFields.Status_Of_Report,
            headerName: 'Status',
            //this type is for filtering and editing
            type: 'singleSelect',
            valueOptions: Object.values(StatusOfReport),
            width: columnWidth.statusOfReport,
            filterOperators: getGridSingleSelectOperators().filter(
                (operator) => operator.value === 'is'
            ),
            renderCell: (params: GridRenderCellParams<any>) => {
                return <Chip variant="outlined" size="small" {...getChipProps(params)} />;
            },
        },
        {
            field: 'actions',
            headerName: '',
            filterable: false,
            sortable: false,
            align: 'center',
            width: columnWidth.actions,
            renderCell: (cellValues: GridRenderCellParams<any>) => (
                <>
                    <ButtonLink
                        style={{ marginRight: '10px' }}
                        size="sm"
                        variant="link"
                        href={`/report/${cellValues.row.reportId}/edit`}
                    >
                        <EditIcon />
                    </ButtonLink>
                    <ButtonLink
                        size="sm"
                        variant="link"
                        href={`/report/${cellValues.row.reportId}`}
                    >
                        <NavigateNextIcon />
                    </ButtonLink>
                </>
            ),
        },
    ];

    return (
        <div style={{ height: 800, width: '100%', minWidth: '800px' }}>
            <DataGrid
                getRowHeight={() => 'auto'}
                rows={reports}
                showCellVerticalBorder={true}
                getRowId={(row) => row.reportId}
                columns={columns}
                filterMode="server"
                onFilterModelChange={onFilterChange}
                loading={isLoading}
                slots={{
                    loadingOverlay: LinearProgress,
                    noRowsOverlay: NoResultsOverlay,
                    toolbar: () => (
                        <CustomToolbar
                            sortOptions={`${sortOptions}`}
                            onSortChange={onSortChange}
                            hasFilter={hasFilter}
                        />
                    ),
                }}
            />
        </div>
    );
}
