import m from './big-card.module.css';
import people from "../../img/avatar.png"
import achievment from "./../../img/achievment.png"
import { NavLink, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Microlink from '@microlink/react';
import { UrlServer } from "../../App"

function BigCard({ dataCard, photo, fromAdd, userId }) {

  const [mainData, setMainData] = useState(null)
  useEffect(() => {
    setMainData(dataCard);
    if(mainData != null){
      getPhotosMembers(mainData)
      if(!fromAdd){
        getComments(mainData)
      }
    }
    
  }, [dataCard, photo, fromAdd, userId])

  const [steps, setSteps] = useState([])
  const [comment, setComment] = useState()
  const [comments, setComments] = useState([])
  const navigate = useNavigate()

  const findStep = async () => {
    if (localStorage.getItem(dataCard._id)) {
      setSteps(JSON.parse(localStorage.getItem(dataCard._id)))
    }
    else {
      const { data } = await axios.post('https://goblin.tools/api/todo/',
        { "text": `Как достичь ${dataCard.title}`, "spiciness": 0, "ancestors": [] })
      localStorage.setItem(dataCard._id, JSON.stringify(data))
      setSteps(data)
    }
  }

  const viewSteps = () => {
    if (steps.length === 0) {
      return <li className={m.step_loading}>loading...</li>
    }
    else {
      return steps.map(step => <li className={m.step}>{step}</li>)
    }
  }

  const viewExit = () => {
    if (!fromAdd) {
      return <NavLink className={m.link_exit} to={-1} >Назад</NavLink>
    }
  }

  const viewFindStep = () => {
    if (!fromAdd) {
      return <NavLink className={m.link_to_step_achieve} onClick={findStep}>Шаги для достижения цели</NavLink>
    }
  }

  const viewLikeOrEdit = () => {
    if (userId != localStorage.getItem("id"))
      return <div className={m.likes}>
        <NavLink className={m.btn_like} onClick={PutLike}>Понравилось {dataCard.likeAmount ? dataCard.likeAmount : 0}</NavLink>
      </div>
    else
      return <div>
        <NavLink className={m.edit} to='./edit'>Редактировать</NavLink>
        <button className={m.btn_like} type="button" onClick={delAchieve} >Удалить</button>
      </div>
  }

  const PutLike = async () => {
    const { data } = await axios.put(`http://${UrlServer()}/api/portfolios/me/achievement/like/${dataCard._id}`, {}, {
      headers: { 'x-access-token': localStorage.getItem('token') },
    })
  }

  const delAchieve = async () => {
    const del = await axios.delete(`http://${UrlServer()}/api/portfolios/me/achievement/${dataCard._id}`, {
      headers: { 'x-access-token': localStorage.getItem('token') },
    })
    navigate(-1)
  }

  const viewLink = () => {
    if (dataCard.url) {
      return (
        <li className={m.achiv_top_add_info_item}>
          <p className={m.achiv_descr_title}>Ссылка</p>
          <Microlink url={dataCard.url} />
        </li>
      )
    }
  }

  const viewComment = () => {
    try {
      return comments.map(({ content }) =>
        <li className={m.achiv_comment_item}>
          <img className={m.achiv_comment_item_image} src={people} alt="user" />
          <p className={m.achiv_comment_item_text}>
            {content}
          </p>
        </li>
      )
    }
    catch {
    }
  }

  const addComment = async () => {
    const add = await axios.post(`http://${UrlServer()}/api/portfolios/achievement/${dataCard._id}/comment`, { "content": comment }, {
      headers: { 'x-access-token': localStorage.getItem('token') },
    })
    const { data } = await axios.get(`http://${UrlServer()}/api/users/${localStorage.getItem('id')}`)
    getPhoto(data.avatar).then(url => {
      setComments((comments) => [...comments, {text : comment, idPerson: localStorage.getItem('id'), imgPerson: url}])
    })
    setComment('')
  }

  const getComments = (data) => {
    (data.comments).map(comment => {
      getPhoto(comment.author.avatar).then(url => {
        console.log(comment)
        setComments((comments) => [...comments, {text : comment.content, idPerson: comment.author._id, imgPerson: url}])
      })
    })
  }

  const [members, setMembers] = useState([])

  const viewMembers = (member) => {
    if (member !== undefined) {
      if (member.avatar !== undefined) {
        return <Link to={`/${userId}`}><img className={m.big_card_image_people} src={people} alt="Фото участника" /></Link>
      }
      else {
        return <Link to={`/${userId}`}><img className={m.big_card_image_people} src={people} alt="Фото участника" /></Link>
      }
    }
  }

  const getPhoto = async (id) => {
    const img = await axios.get(`http://${UrlServer()}/api/content/photo/${id}`, { responseType: "blob" })
    const url = URL.createObjectURL(img.data)
    return url;
  }

  const getPhotosMembers = (dataCard) => {
    setMembers([])
    if(dataCard.members !== null){
      (dataCard.members).map(member => {
        if(member.avatar !== undefined) {
          getPhoto(member.avatar).then( url => {
            setMembers((members) => [...members, {id: member._id, link: url}])
          })
        }
        else {
          setMembers((members) => [...members, {id: member, link: people}])
        }
      })
    }
  }

  return (
    <main className={m.main}>
      <section className={m.container}>
        <div className={m.container_big_card_achiv}>
          {viewExit()}
          <div className={m.steps}>
            {viewFindStep()}

            <ul className={m.step_to_achieve}>
              {viewSteps()}
            </ul>
          </div>

          <div className={m.big_card_achiv_main_information}>
            <div className={m.achiv_top}>
              <div className={m.achiv_top_main_info}>
                <img className={m.image_achiv} src={photo} alt="achievment" />
                <div className={m.achiv_top_main_info_text}>
                  <h2 className={m.achiv_title}>{dataCard.title}</h2>
                  <p className={m.achiv_descr_title}>Описание</p>
                  <p className={m.achiv_descr_text}>{dataCard.shortDescription}</p>
                  {viewLikeOrEdit()}
                </div>
              </div>
              <div className={m.achiv_top_add_info}>
                <ul className={m.achiv_top_add_info_list}>
                  <li className={m.achiv_top_add_info_item}>
                    <p className={m.achiv_descr_title}>История</p>
                    <p className={m.achiv_descr_text}>{dataCard.fullDescription}</p>
                  </li>
                  {viewLink()}
                  <li className={m.achiv_top_add_info_item}>
                    <p className={m.achiv_descr_title}>Участники</p>
                    {members.map(member => {
                      return <Link to={`/${member.id}`}><img className={m.big_card_image_people} src={member.link} alt="Фото участника" /></Link>
                    })}
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className={m.achiv_comment}>
            <h2 className={m.achiv_comment_title}>Комментарии</h2>
            <ul className={m.achiv_comment_list}>
              {comments.map(comment => {
                return (
                  <li className={m.achiv_comment_item}>
                    <Link to={`/${comment.idPerson}`}><img className={m.achiv_comment_item_image} src={comment.imgPerson} alt="user" /></Link>
                    <p className={m.achiv_comment_item_text}>
                      {comment.text}
                    </p>
                  </li>
                )
              })}
            </ul>
            <form className={m.achiv_comment_add}>
              <textarea className={m.achiv_comment_add_text} name="comment" placeholder='Комментарий' value={comment} onChange={(e) => { setComment(e.target.value) }}></textarea>
              <button type="button" className={m.achiv_comment_add_btn} onClick={addComment}>Отправить</button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}

export default BigCard;
