/* Photo upload section */
import React, { Component } from 'react';
import { Button, Container, Grid, Image, Icon, Input } from 'semantic-ui-react';
import Cookies from 'js-cookie';

export default class PhotoUpload extends Component {
    constructor(props) {
        super(props);
        this.state = { selectedFile: null, imageId: this.props.imageId, preview: null, saveBtnDisabled: false }
        this.onFileChange = this.onFileChange.bind(this)
        this.uploadPhoto = this.uploadPhoto.bind(this)
    };

    onFileChange(e) {
        if (e.target.files[0] === undefined) return
        this.setState({ selectedFile: e.target.files[0] })

        var reader = new FileReader()
        reader.onload = (event) => {
            this.setState({ preview: event.target.result })
        }
        reader.readAsDataURL(e.target.files[0])

    };

    uploadPhoto() {
        this.setState({ saveBtnDisabled: true })
        var formData = new FormData();
        formData.append("file", this.state.selectedFile)
        var cookies = Cookies.get('talentAuthToken');
        const httpRequest = new XMLHttpRequest()
        var url = this.props.savePhotoUrl

        httpRequest.open("POST", url, true);
        httpRequest.setRequestHeader('Authorization', 'Bearer ' + cookies)
        httpRequest.onload = () => {
            const res = JSON.parse(httpRequest.response)
            if (res.success) {
                TalentUtil.notification.show("Profile updated sucessfully", "success", null, null)
                this.setState({ selectedFile: null, saveBtnDisabled: false })
            } else {
                this.setState({ saveBtnDisabled: false })
                TalentUtil.notification.show("Profile did not update successfully", "error", null, null)
            }
        }
        httpRequest.onerror = () => {
            this.setState({ saveBtnDisabled: false })
            TalentUtil.notification.show("Profile did not update successfully", "error", null, null)
            console.log(httpRequest.response)
        }
        httpRequest.send(formData);
    }


    render() {
        // console.log(this.state)

        return (
            <Container className='profile-container'>
                <Grid padded columns={2} container>
                    <Grid.Column className='profile-grid' width={6}>
                        <h3>Profile Photo</h3>
                    </Grid.Column>
                    <Grid.Column className='profile-grid' textAlign='center' width={3}>
                        <input type='file' id='image-picker' onChange={this.onFileChange}
                            accept="image/jpg, image/png, image/gif, image/jpeg"
                        />
                        <Image circular
                            src={this.state.preview ? this.state.preview : this.state.imageId}
                            onClick={() => { document.getElementById("image-picker").click() }}>
                            {this.state.imageId ? null : <Icon name='camera' size='huge' circular />}
                        </Image>
                        {this.state.selectedFile ? <Button primary disabled={this.state.saveBtnDisabled}
                            onClick={(e) => { e.preventDefault(); this.uploadPhoto() }}>
                            Upload
                        </Button> : null}
                    </Grid.Column>
                </Grid>
            </Container>
        )
    }
}
