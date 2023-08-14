const onGAPILoad = async () => {
  await gapi.client.init({
    apiKey: 'AIzaSyB08ejkEhqLAlHYDzSbqkl',
    clientId: '749711979920-2t5ip02556cbojn4u2k7q9ar9e8kjtqh.apps.googleusercontent.com',
    scope: 'https://www.googleapis.com/auth/drive.file',
    discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
  });

gapi.auth2.getAuthInstance().isSignedIn.listen(updateSignInStatus);

updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
};

const updateSignInStatus = (isSignedIn) => {
  if (isSignedIn) {
    $('#signin').hide();
    $('#file-input').show();
    $('#file-input').on('change', handleFileUpload);
  } else {
    $('#signin').show();
    $('#signin').on('click', () => gapi.auth2.getAuthInstance().signIn());
  }
};

const findOrCreateFolder = async (folderName) => {
  const query = `mimeType='application/vnd.google-apps.folder' and trashed=false and name='${folderName}'`;
  let folders;

  try {
    const response = await gapi.client.drive.files.list({
      q: query,
      fields: 'nextPageToken, files(id, name)',
    });

    folders = response.result.files;
  } catch (error) {
    console.error('Error finding folder:', error);
  }

  let folderId;

  if (folders && folders.length === 0) {
    try {
      const metadata = {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
      };

      const response = await gapi.client.drive.files.create({ resource: metadata });
      folderId = response.result.id;

      console.log(`Created new folder ${folderName} with ID: ${folderId}`);
    } catch (error) {
      console.error('Error creating new folder:', error);
    }
  }else{
    folderId = folders[0].id;
  }

  return folderId;
};

const handleFileUpload = async (event) => {
  const file = event.target.files[0];

  if (file.type !== 'application/pdf') {
    alert('PDF 파일만 업로드해 주세요!');
    return;
  }

  const folderId = await findOrCreateFolder('PDF_Uploads');

  const metadata = {
    name: file.name,
    mimeType: file.type,
    parents: [folderId],
  };

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
};

gapi.load('client:auth2', onGAPILoad);
