import { Client,Account,ID, Avatars, Databases, Query, Storage,ImageGravity} from 'react-native-appwrite';
export const appwriteConfig={
    endPoint:'https://cloud.appwrite.io/v1',
    platform:'com.jsm.aora',
    projectId:"672327bb0026486dbb22",
    databaseId:'672329840036cb66af82',
    userCollectionId:"672329ca00236339e860",
    videoCollectionId:"672329e1003afd511dc0",
    storageId:"67232bab0003226b79ff"
}
const {endPoint,
    platform,
    projectId,
    databaseId,
    userCollectionId,
    videoCollectionId,
    storageId,}=appwriteConfig;
// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(appwriteConfig.endPoint) // Your Appwrite Endpoint
    .setProject(appwriteConfig.projectId) // Your project ID
    .setPlatform(appwriteConfig.platform) // Your application ID or bundle ID.
;
const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage=new Storage(client);
export const createUser=async(email:string,password:string,username:string)=>{
    try{
        const newAccount=await account.create(ID.unique(),email,password,username);
        if(!newAccount){
            throw Error()
        }
        const avatarUrl=avatars.getInitials(username);
        await signIn(email,password);
        const newUser=await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            {
                account_id: newAccount.$id,
                email: email,
                username: username,
                avatar: avatarUrl,
            }
        )
        return newUser;
    }
    catch(error:any){
        console.log(error)
        throw new Error(error);
    }
}
export const signIn=async(email:string,password:string) =>{
    try{
        const session=await account.createEmailPasswordSession(email,password);
    }
    catch(error:any){
        console.log(error)
        throw new Error(error);
    }
}

export const getCurrentUser=async()=>{
    try{
        const currentAccount=await account.get();
        if(!currentAccount)  throw Error;

        const currentUser=await databases.listDocuments(
            appwriteConfig.databaseId,appwriteConfig.userCollectionId,[Query.equal('account_id',currentAccount.$id)]
        )
        if(!currentUser) throw Error;
        return currentUser.documents[0];

    }catch(error){

    }

}
export const getAllPosts=async()=>{
    try{
        const posts=await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.orderDesc('$createdAt')]
        )
        return posts.documents;
    }
    catch(error:any){
        throw new Error(error);
    }
}
export const getLatestPosts=async()=>{
    try{
        const posts=await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.orderDesc('$createdAt')]
        )
        return posts.documents;
    }
    catch(error:any){ 
        throw new Error(error);
    }
}
export const searchPosts=async(query:any)=>{
    try{
        const posts=await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.search('title',query)]
        )
        return posts.documents;
    }
    catch(error:any){ 
        throw new Error(error);
    }
}
export const getUserPosts=async(userId:any)=>{
    try{
        const posts=await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.equal('users',userId),Query.orderDesc('$createdAt')]
        )
        return posts.documents;
    }
    catch(error:any){ 
        throw new Error(error);
    }
}
export const signOut=async()=>{
    try{
        const session=await account.deleteSession('current');
        return session;
    }catch(error:any){
        throw new Error(error.message);
    }
}
export const getFilePreview=async(fileId:any,type:any)=>{
    let fileUrl:any;
    try{
        if(type==='video'){
            fileUrl=storage.getFileView(storageId,fileId);
            console.log(fileUrl)
        }else if(type==='image'){
            fileUrl=storage.getFilePreview(storageId,fileId,2000,2000,ImageGravity.Top,100);
            console.log(fileUrl)

        }
        else{
            throw new Error('Invalid file type');
        }
        if(!fileUrl) throw Error;
        return fileUrl;
    }catch(error:any){
        throw new Error(error)
    }
}
export const uploadFile=async(file:any,type:any)=>{
    if(!file) return;
    const asset={
        name: file.fileName,
        type: file.mimeType,
        size: file.fileSize,
        uri: file.uri,
    };
    console.log(asset)

    try{
        const uploadedFile:any=await storage.createFile(
            storageId,
            ID.unique(),
            asset
        )
        console.log("uploadedFile",uploadedFile);
        const fileUrl=await getFilePreview(uploadedFile.$id,type);
        return fileUrl;
    }catch(error:any){
        throw new Error(error)
    }
}
export const createVideo=async(form:any)=>{
    try{
        const [thumbnailUrl,videoUrl]=await Promise.all([
            uploadFile(form.thumbnail,'image'),
            uploadFile(form.video,'video') 
        ])
        console.log(thumbnailUrl,videoUrl)
        const newPost=await databases.createDocument(databaseId,
            videoCollectionId,
            ID.unique(),
            {
                title:form.title,
                thumbnail:thumbnailUrl,
                video_url:videoUrl,
                users:form.userId,
                prompt:form.prompt
            }
        )
        return newPost;
    }catch(error:any){
        throw new Error(error)
    }
}