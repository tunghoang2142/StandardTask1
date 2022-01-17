/* Language section */
import React from 'react';
import Cookies from 'js-cookie';
import { Button, Icon, Table, Container, TableCell } from 'semantic-ui-react';

export default class ProfileTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: ["Language", "Level"],
            data: [{ id: "0", language: "A", level: "Basic" }, { id: "1", language: "B", level: "Advance" }],
            editOpen: [],
            addOpen: false
        }
        this.openEdit = this.openEdit.bind(this)
        this.closeEdit = this.closeEdit.bind(this)
        this.openAdd = this.openAdd.bind(this)
        this.closeAdd = this.closeAdd.bind(this)
    }

    openEdit(id) {
        this.setState({
            editOpen: [...this.state.editOpen, id]
        })
    }

    closeEdit(id) {
        this.setState({
            editOpen: this.state.editOpen.filter(openId => openId !== id)
        })
    }

    openAdd() {
        this.setState({
            addOpen: true
        })
    }

    closeAdd() {
        this.setState({
            addOpen: false
        })
    }

    renderButton(newProps = {}, baseProps = {}) {
        var btnProps = Object.assign({}, baseProps)
        btnProps = Object.assign(btnProps, newProps)
        return (<Button {...btnProps} >{btnProps.children}</Button>)
    }

    render() {
        const defaultCloseBtnProps = this.props.defaultCloseBtnProps
        const editBtnProps = this.props.editBtnProps ? this.props.editBtnProps : this.props.defaultBtnProps
        const editCloseBtnProps = this.props.editCloseBtnProps ? this.props.editCloseBtnProps : defaultCloseBtnProps
        return (
            <Container className='profile-container'>
                {/* Display add */}
                {this.state.addOpen ? <this.props.form
                    UpdateButton={(newProps) => { return this.renderButton(newProps, this.props.defaultBtnProps) }}
                    CloseButton={(newProps) => { return this.renderButton(newProps, defaultCloseBtnProps) }}
                    handleUpdate={(data) => this.props.handleAdd(data, () => { this.closeAdd() })}
                    handleClose={this.closeAdd}
                /> : null}
                <Table>
                    <Table.Header>
                        <Table.Row>
                            {this.props.columns.map(column => {
                                return (
                                    <Table.HeaderCell key={column}>{column}</Table.HeaderCell>
                                )
                            })}
                            <Table.HeaderCell>
                                <Button secondary floated='right' onClick={(e) => { e.preventDefault(); this.openAdd() }}>+ Add New</Button>
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {this.props.data.map(data => {
                            var displayData = Object.assign({}, data)
                            var id = displayData.id
                            // Remove id column from table
                            delete displayData.id
                            // Display edit
                            if (this.state.editOpen.includes(id)) {
                                return (
                                    <Table.Row key={id}><TableCell colSpan={Object.keys(displayData).length + 1}>
                                        <this.props.form
                                            data={data}
                                            UpdateButton={(newProps) => { return this.renderButton(newProps, editBtnProps) }}
                                            CloseButton={(newProps) => { return this.renderButton(newProps, editCloseBtnProps) }}
                                            handleUpdate={(data) => this.props.handleEdit(data, () => { this.closeEdit(id) })}
                                            handleClose={() => this.closeEdit(id)}
                                        />
                                    </TableCell></Table.Row>)
                            } else {
                                // Display view
                                return (
                                    <Table.Row key={id}>
                                        {Object.keys(displayData).map(key => <Table.Cell key={key}>{displayData[key]}</Table.Cell>)}
                                        <Table.Cell>
                                            <Container fluid textAlign='right'>
                                                <Icon name="pencil" onClick={() => this.openEdit(id)} />
                                                <Icon name="x" onClick={() => this.props.handleDelete(id)} />
                                            </Container>
                                        </Table.Cell>
                                    </Table.Row>
                                )
                            }
                        })}
                    </Table.Body>
                </Table>
            </Container>
        )
    }
}