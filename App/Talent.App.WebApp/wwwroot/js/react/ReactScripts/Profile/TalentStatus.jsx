import React from 'react'
import { Container, Radio, Form, Item } from 'semantic-ui-react';
import { SingleInput } from '../Form/SingleInput.jsx';

export default class TalentStatus extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            status: this.props.status.status,
            isDisabled: false
        }
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(_, { value }) {
        if (this.state.isDisabled) return
        this.setState({ isDisabled: true })
        var data = { jobSeekingStatus: Object.assign({}, this.props.status) }
        data.jobSeekingStatus = Object.assign(data.jobSeekingStatus, { status: value })
        this.props.saveProfileData(data, (bool) => {
            this.setState({ isDisabled: false })
            if (bool) this.setState({ status: value })
        })
    }

    render() {
        const status = [
            { key: 0, value: "Actively looking for a job" },
            { key: 1, value: "Not looking for a job at the moment" },
            { key: 2, value: "Currently employed but open for offers" },
            { key: 3, value: "Will be availble on later date" }
        ]
        return (
            <Container className='profile-container' >
                <Item>
                    <Form.Field>
                        <p className='profile-label'>Current Status</p>
                    </Form.Field>
                    {status.map(e => {
                        return (
                            < Form.Field key={e.key}>
                                <Radio
                                    label={e.value}
                                    value={e.value}
                                    checked={this.state.status === e.value}
                                    onChange={this.handleChange}
                                />
                            </Form.Field>
                        )
                    })}
                </Item>
            </Container >
        )
    }
}