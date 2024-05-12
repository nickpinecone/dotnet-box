import m from './big-card.module.css';
import people from "../../img/avatar.png"
import achievment from "./../../img/achievment.png"
import { NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Microlink from '@microlink/react';

function BigCard({ dataCard, photo, fromAdd, userId}) {
  const [steps, setSteps] = useState([])
  const [comment, setComment] = useState()
  const [comments, setComments] = useState(dataCard.comments)
  const navigate = useNavigate()

  const findStep = async() => {
    if(localStorage.getItem(dataCard._id)){
      setSteps(JSON.parse(localStorage.getItem(dataCard._id)))
    }
    else{
      const { data } = await axios.post('https://goblin.tools/api/todo/', 
      {"text": `Как достичь ${dataCard.title}`, "spiciness": 0, "ancestors": []})
      localStorage.setItem(dataCard._id, JSON.stringify(data))
      setSteps(data)
    }
  }

  const viewSteps = () => {
    if(steps.length === 0){
      return <li className={m.step_loading}>loading...</li>
    }
    else{
      return steps.map(step => <li className={m.step}>{step}</li>)
    }
  }

  const viewExit = () => {
    if(!fromAdd){
      return <NavLink className={m.link_exit} to={-1} >Назад</NavLink>
    }
  }

  const viewFindStep = () => {
    if(!fromAdd){
      return <NavLink className={m.link_to_step_achieve} onClick={findStep}>Шаги к достижению цели</NavLink>
    }
  }

  const viewLikeOrEdit = () => {
    if(userId != localStorage.getItem("id"))
      return <button className={m.btn_like} type="button">Понравилось</button>
    else
      return (
    <div>
      <button className={m.btn_like} type="button" >Редактировать</button>
      <button className={m.btn_like} type="button" onClick={delAchieve} >Удалить</button>
    </div>)
  }

  const delAchieve = async() => {
    const del = await axios.delete(`http://localhost:4000/api/portfolios/me/achievement/${dataCard._id}`, {
      headers: { 'x-access-token': localStorage.getItem('token') },
    })
    navigate(-1)
  }

  const viewLink = () => {
    if(dataCard.url){
      return (
        <li className={m.achiv_top_add_info_item}>
          <p className={m.achiv_descr_title}>Ссылка</p>
          <Microlink url={dataCard.url} />
        </li>
      )
    }
  }
  
  const viewComment = () => {
    try{
      return comments.map(({content}) => 
        <li className={m.achiv_comment_item}>
          <img className={m.achiv_comment_item_image} src={people} alt="user" />
          <p className={m.achiv_comment_item_text}>
            {content}
          </p>
        </li>
      )
    }
    catch{
    }
  }

  const addComment = async() => {
    const add = await axios.post(`http://localhost:4000/api/portfolios/achievement/${dataCard._id}/comment`, {"content": comment}, {
      headers: { 'x-access-token': localStorage.getItem('token') },
    })
    const {data} = await axios.get(`http://localhost:4000/api/portfolios/achievement/${dataCard._id}`)
    setComments(data.comments)
    setComment("")
  }

  const[photos, setPhotos] = useState()

  const viewMembers = () =>{
    return <img className={m.big_card_image_people} src={photos} alt="Фото участника" />
  }

  const getPhoto = async(id) => {
    const img = await axios.get(`http://localhost:4000/api/photos/${id}`, { responseType: "blob" })
    const url = URL.createObjectURL(img.data)
    setPhotos(url)
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
                    <p className={m.achiv_descr_title}>Подробное описание</p>
                    <p className={m.achiv_descr_text}>{dataCard.fullDescription}</p>
                  </li>
                  {viewLink()}
                  <li className={m.achiv_top_add_info_item}>
                    <p className={m.achiv_descr_title}>Участники</p>
                    <img className={m.big_card_image_people} src={people} alt="Фото участника" />
                    <img className={m.big_card_image_people} src={people} alt="Фото участника" />
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className={m.achiv_comment}>
            <h2 className={m.achiv_comment_title}>Комментарии</h2>
            <ul className={m.achiv_comment_list}>
            {viewComment()}
            </ul>
            <form className={m.achiv_comment_add}>
              <textarea className={m.achiv_comment_add_text} name="comment" autoFocus="none" placeholder='Комментарий' value={comment} onChange={(e) => { setComment(e.target.value) }}></textarea>
              <button type="button" className={m.achiv_comment_add_btn} onClick={addComment}>Отправить</button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}

export default BigCard;
