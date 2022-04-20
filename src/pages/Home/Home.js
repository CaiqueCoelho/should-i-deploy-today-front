import React, { useEffect, useState } from 'react';
import './home.css'
import './login.css'
import Spinner from 'react-spinner-material';
import axios from 'axios';

import BestTime from './BestTime';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';

const ColorButton = withStyles((theme) => ({
  root: {
    color: '#FFFFFF',
    backgroundColor: '#449AE2',
    '&:hover': {
      backgroundColor: '#249AE2',
    },
    marginTop: "10px",
    marginBottom: "30px",
    width: '100%',
  },
}))(Button);

const NextTimeButton = withStyles((theme) => ({
  root: {
    color: '#449AE2',
    backgroundColor: '#FFFFFF',
    '&:hover': {
      backgroundColor: '#249AE2',
      color: '#FFFFFF',
    },
    width: '100%',
    marginBottom: "20px",
  },
}))(Button);

export default function Home() {

    const [runLoad, setRunLoad] = useState(false);
    const [city, setCity] = useState('São Paulo');
    const [lastCity, setLastCity] = useState('');
    const [times, setTimes] = useState([]);
    const [nextTime, setNextTime] = useState(0);
    const [bestTime, setBestTime] = useState({temp: 0, datetimeStr: ''});
    const [otherTime, setOtherTime] = useState(false);
    const [openToast, setOpenToast] = useState(false);
    const [toastMessage, setToastMessage] = useState(false);

  function cleanStates(){
    setNextTime(0);
    setBestTime('');
    setTimes([]);
    setLastCity('')
  }

  function handleChangeCity(e) {
    setCity(e.target.value);
    cleanStates();
  }

  async function getWeather(callForecastAgain, otherTime) {
    try {
      setRunLoad(true);
      setOtherTime(otherTime)

      if(city.length > 50){
        setToastMessage("Erro tentar buscar pela cidade, tente novamente!");
        setOpenToast(true)
        setRunLoad(false);
        return ;
      }

      if((lastCity !== city) || callForecastAgain){
        setLastCity(city);
        setRunLoad(true);

        let payload = { location: city.trim() };

        const res = await axios.post('https://melhor-horario-banho.herokuapp.com/forecast-weather', 
          payload
        ).catch((error) => {
          console.error(error);
          setToastMessage(error.message);
          setOpenToast(true);
          setRunLoad(false);
          return error;
        });

        if(res.status !== 200){
          console.error(res)
          setToastMessage("Erro ao buscar pela cidade, tente novamente!");
          setOpenToast(true)
          setRunLoad(false)
          cleanStates();
          return ;
        }
      
        const datesList = []
        res.data.locations[0].values.map( date => {
          if(date.datetimeStr.includes(getDate())){
            datesList.push(date)
          }
          
        })
        setTimes(datesList);
        setOpenToast(false)
      } else {
        setRunLoad(false);
        setOpenToast(false)
      }
    } catch (error) {
      console.error(error.message)
      setToastMessage(error.message);
      setOpenToast(true)
    }
  }
  
  function getDate() {
    let today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();
  
    today = mm + '/' + dd + '/' + yyyy;
    const mmdd = mm + '-' + dd
    return mmdd;
  }

  function getFullDate() {
    const today = new Date();
    const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    return date;
  }

  function getTime() {
    const today = new Date();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    return time;
  }

    useEffect(() => {
    }, [])

    return (
        <div>
            <h1 className='title-page'>Qual a melhor hora para tomar banho?</h1>
            <p className='subtitle-page'><b>Não passe frio</b> e <b>economize energia</b> tomando seu banho todos os dias no horário que está mais quentinho</p>

            <TextField className="custom-input" id="outlined-basic" label="Qual cidade você está?" variant="outlined" onChange={handleChangeCity} value={city} aria-label="Qual cidade você está?" placeholder="Qual cidade você está?"/>

            <ColorButton variant="contained" color="primary" onClick={() => getWeather(false, false)}>
              Buscar melhor horário
            </ColorButton>

            {runLoad && (<span className='spinner'>
                <Spinner className='spinner' size={60} spinnerColor={"#449AE2"} visible={runLoad} />
            </span>)}

            { times.length > 0 && (<p className='paragraph'>O melhor horário para você tomar seu banho hoje é:</p>)}
            { times.length > 0 && 
            <BestTime
              bestTime={bestTime}
            />
            }

            { times.length > 0 && 
            <NextTimeButton variant="contained" color="primary" onClick={() => getWeather(false, true)}>
              Buscar outro horário
            </NextTimeButton>
            }

            <Snackbar
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
              key={'bottom,center'}
              open={openToast}
              autoHideDuration={3000}
              ContentProps={{
                'aria-describedby': 'message-id',
              }}
              message={<span id="message-id">{toastMessage}</span>}
            />
        </div>
    );
}