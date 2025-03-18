import { useEffect, useState } from "react"
import { useAppSelector } from "src/redux/reducer/reducer"
import { databaseRef } from "src/utils/useFirebase/useFirebase"
import useTimeCalculation from "src/utils/useTimeCalculation/useTimeCalculation"

const useReply = ({item,commentId}:{item:{
    id: string | null;
    comment: string;
    createdAt: number;
    uid: string;
    numberOfReplies:number;
    profileName:string;
    likes:number;
  },commentId:string}) => {
    const [profileImage, setProfileImage] = useState('')
    const [profileName, setProfileName] = useState('')
    const [isLiked,setIsLiked] = useState(false)
    const [repliedUser,setRepliedUser] = useState('')
    const timeString = useTimeCalculation({time:item.createdAt,short:true})
    const likeArray =item?.likes? Object.keys(item?.likes):[]
    const uid = useAppSelector(state=>state.userReducer.userDetails?.uid)
    const like = async () => {
        try{
            await databaseRef(`commentsReplies/${commentId}/${item.id}/likes/${uid}`).set(true)
        }
        catch(error){
            console.error(error);
            
        }
    }
    const unLike = async () => {
        try{
            await databaseRef(`commentsReplies/${commentId}/${item.id}/likes/${uid}`).remove()
        }
        catch(error){
            console.error(error);
            
        }        
    }
    useEffect(()=>{
        const fetchReplyUserData = async () => {
            try{
                await databaseRef(`users/${item.uid}/photoURL`).once('value',snapshot => {
                    snapshot.exists() && setProfileImage(snapshot.val( ));
                })
                await databaseRef(`users/${item.uid}/displayName`).once('value',snapshot => {
                    snapshot.exists() &&  setProfileName(snapshot.val())
                })
            }
            catch(error){
                console.error(error);
            }
        }
        fetchReplyUserData()
    },[])
  return {
    profileName,
    profileImage,
    isLiked,
    repliedUser,
    setIsLiked,
    timeString,
    like,
    unLike,
    likeArray,
    uid
  }
}

export default useReply