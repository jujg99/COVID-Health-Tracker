import React from 'react';
import { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel } from '@material-ui/core';
import { Toolbar, Typography, Paper, Checkbox, IconButton, Tooltip, FormControlLabel, Switch } from '@material-ui/core';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import SearchBar from "material-ui-search-bar";
import { useLocation } from 'react-router-dom';
import axios from "axios";

const Users = () => {
    const { state } = useLocation();
    const [rows, setRows] = useState(state);

    // Custom comparator to order object a and b based on orderBy
    function descendingComparator(a, b, orderBy) {
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
    }

    // Based on order (desc or asc) returns descendingComparator (- or + respectively)
    function getComparator(order, orderBy) {
        return order === 'desc'
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy);
    }

    // Stabilizes array then sorts the contents of array
    function stableSort(array, comparator) {
        const stabilizedThis = array.map((el, index) => [el, index]);
        stabilizedThis.sort((a, b) => {
            const order = comparator(a[0], b[0]);
            if (order !== 0) return order;
            return a[1] - b[1];
        });
        return stabilizedThis.map((el) => el[0]);
    }

    // Header names of user table
    const headCells = [
        { id: 'name', disablePadding: true, label: 'Name' },
        { id: 'username', disablePadding: false, label: 'Username' },
        { id: 'age', disablePadding: false, label: 'Age' },
        { id: 'atRisk', disablePadding: false, label: 'At Risk' },
        { id: 'city', disablePadding: false, label: 'City' },
        { id: 'state', disablePadding: false, label: 'State' },
    ];

    // Custom table head for user table with specific functions (selecting all, sorting, etc.)
    function EnhancedTableHead(props) {
        const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
        const createSortHandler = (property) => (event) => {
            onRequestSort(event, property);
        };

        return (
            <TableHead>
                <TableRow>
                    <TableCell padding="checkbox">
                        <Checkbox
                            indeterminate={numSelected > 0 && numSelected < rowCount}
                            checked={rowCount > 0 && numSelected === rowCount}
                            onChange={onSelectAllClick}
                            inputProps={{ 'aria-label': 'select all users' }}
                        />
                    </TableCell>
                    {headCells.map((headCell) => (
                        <TableCell
                            key={headCell.id}
                            padding={headCell.disablePadding ? 'none' : 'default'}
                            sortDirection={orderBy === headCell.id ? order : false}
                        >
                            <TableSortLabel
                                active={orderBy === headCell.id}
                                direction={orderBy === headCell.id ? order : 'asc'}
                                onClick={createSortHandler(headCell.id)}
                            >
                                {headCell.label}
                                {orderBy === headCell.id ? (
                                    <span className={classes.visuallyHidden}>
                                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                    </span>
                                ) : null}
                            </TableSortLabel>
                        </TableCell>
                    ))}
                </TableRow>
            </TableHead>
        );
    }

    EnhancedTableHead.propTypes = {
        classes: PropTypes.object.isRequired,
        numSelected: PropTypes.number.isRequired,
        onRequestSort: PropTypes.func.isRequired,
        onSelectAllClick: PropTypes.func.isRequired,
        order: PropTypes.oneOf(['asc', 'desc']).isRequired,
        orderBy: PropTypes.string.isRequired,
        rowCount: PropTypes.number.isRequired,
    };

    // CSS styles for table toolbar
    const useToolbarStyles = makeStyles((theme) => ({
        root: {
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(1),
        },
        highlight:
            theme.palette.type === 'light'
                ? {
                    color: theme.palette.secondary.main,
                    backgroundColor: lighten(theme.palette.secondary.light, 0.85),
                }
                : {
                    color: theme.palette.text.primary,
                    backgroundColor: theme.palette.secondary.dark,
                },
        title: {
            flex: '1 1 100%',
        },
    }));

    // Custom table toolbar (above table header) for specific functions (deleting users, searching users, etc.)
    const EnhancedTableToolbar = (props) => {
        const classes = useToolbarStyles();
        const { numSelected, selected } = props;

        // Upon user delete, remove user from table
        const deleteUsers = () => {
            selected.map(username => handleDelete(username));
            const newRows = rows.filter((row) => !selected.includes(row.username));

            setRows(newRows);
            requestSearch(searched, newRows);
            setSelected([]);
        }

        return (
            <Toolbar
                className={clsx(classes.root, {
                    [classes.highlight]: numSelected > 0,
                })}
            >
                {numSelected > 0 ? (
                    <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
                        {numSelected} selected
                    </Typography>
                ) : (
                    <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
                        List of Users
                    </Typography>
                )}

                {numSelected > 0 &&
                    <Tooltip title="Remove User(s)">
                        <IconButton onClick={() => deleteUsers()}>
                            <DeleteForeverIcon />
                        </IconButton>
                    </Tooltip>
                }
            </Toolbar>
        );
    };

    EnhancedTableToolbar.propTypes = {
        numSelected: PropTypes.number.isRequired,
    };

    // CSS for user table
    const useStyles = makeStyles((theme) => ({
        root: {
            width: '100%',
        },
        paper: {
            width: '100%',
            marginBottom: theme.spacing(2),
        },
        table: {
            minWidth: 750,
        },
        visuallyHidden: {
            border: 0,
            clip: 'rect(0 0 0 0)',
            height: 1,
            margin: -1,
            overflow: 'hidden',
            padding: 0,
            position: 'absolute',
            top: 20,
            width: 1,
        },
    }));

    const classes = useStyles();
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('name');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    // Event handler, detects whether column is ascending or descending
    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    // Event handler for when select all is clicked
    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = filteredRows.map((n) => n.username);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    // Event handler for when specific row is clicked
    const handleClick = (event, username) => {
        const selectedIndex = selected.indexOf(username);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, username);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };

    // Event handler for when next page is clicked
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Event handler for when # of rows per page is changed
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Event handler for when page density is clicked
    const handleChangeDense = (event) => {
        setDense(event.target.checked);
    };

    // Event handler for when user delete button is clicked
    const handleDelete = (username) => {
        const data = {
            username: username,
        };
        return axios
            .post("/admin/delete", data)
            .then((response) => {
                console.log(response);
            })
            .catch((err) => {
                console.error(err);
            });
    }

    const isSelected = (username) => selected.indexOf(username) !== -1;
    const [filteredRows, setFilteredRows] = useState(rows);
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);
    const [searched, setSearched] = useState("");

    // Updates user table when search bar is updated
    const requestSearch = (searchedVal, rows) => {
        setSearched(searchedVal);
        const newRows = rows.filter((row) => {
            return row.name.toLowerCase().includes(searchedVal.toLowerCase());
        });
        setFilteredRows(newRows);
    };

    // Resets search bar and user table when search is canceled
    const cancelSearch = () => {
        setSearched("");
        requestSearch(searched, rows);
    };

    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <SearchBar
                    placeholder='Search Name'
                    value={searched}
                    onChange={(searchVal) => requestSearch(searchVal, rows)}
                    onCancelSearch={() => cancelSearch()}
                />
                <EnhancedTableToolbar numSelected={selected.length} selected={selected} />

                <TableContainer>
                    <Table
                        className={classes.table}
                        aria-labelledby="tableTitle"
                        size={dense ? 'small' : 'medium'}
                        aria-label="enhanced table"
                    >
                        <EnhancedTableHead
                            classes={classes}
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                        />
                        <TableBody>
                            {stableSort(filteredRows, getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => {
                                    const isItemSelected = isSelected(row.username);
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        <TableRow
                                            hover
                                            onClick={(event) => handleClick(event, row.username)}
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={row.name}
                                            selected={isItemSelected}
                                        >
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    checked={isItemSelected}
                                                    inputProps={{ 'aria-labelledby': labelId }}
                                                />
                                            </TableCell>
                                            <TableCell component="th" id={labelId} scope="row" padding="none">
                                                {row.name}
                                            </TableCell>
                                            <TableCell>{row.username}</TableCell>
                                            <TableCell>{row.age}</TableCell>
                                            <TableCell>{row.atRisk}</TableCell>
                                            <TableCell>{row.city}</TableCell>
                                            <TableCell>{row.state}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            {emptyRows > 0 && (
                                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </Paper>
            <FormControlLabel
                control={<Switch checked={dense} onChange={handleChangeDense} />}
                label="Minimize"
            />
        </div>
    );
}

export default Users;
