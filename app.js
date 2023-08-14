async function onGAPILoad() {
  await gapi.client.init({
    apiKey: 'AIzaSyB08ejkEhqLAlHYDzSbqkl',
    clientId: '749711979920-2t5ip02556cbojn4u2k7q9ar9e8kjtqh.apps.googleusercontent.com',
    scope: 'https://www.googleapis.com/auth/drive.file',
    discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
  });
  
  gapi.auth2.getAuthInstance().isSignedIn.listen(updateSignInStatus);
  
  updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
}

function updateSignInStatus(isSignedIn) {
  if (isSignedIn) {
    $('#signin').hide();
    $('#file-input').show();
    $('#file-input').on('change', handleFileUpload);
  } else {
    $('#signin').show();
    $('#signin').on('click', () => gapi.auth2.getAuthInstance().signIn());
  }
}

async function handleFileUpload(event) {
  const file = event.target.files[0];
  const metadata = { name: file.name, mimeType: file.type };
  
  try {
    const accessToken = gapi.auth.getToken().access_token;
    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', file);

    const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
      method: 'POST',
      headers: new Headers({ 'Authorization': 'Bearer ' + accessToken }),
      body: form,
    });

    const jsonResponse = await response.json();
    console.log(`File uploaded successfully: ID - ${jsonResponse.id}`);
  } catch (error) {
    console.error('Error uploading file:', error);
  }
}

gapi.load('client:auth2', onGAPILoad);
