import React from 'react';
import './home.css'
import './candidates.css';
import './ranking.css';
import './notifications.css';
import '../../App.css'
import { parseTime } from './utils';

import logo from '../../assets/logo-icon.png'

export default function BestTime(props) {

    return (
        <div className='comment-card'>
            { parseTime(props.bestTime) && (<div id={props.id} className='ranking-container'>
                <img className='photo' src={logo} alt="ícone temperatura" />
                <div>
                  <p className='user-name-ranking'>Às <b>{parseTime(props.bestTime)}</b> horas</p>
                  <p className='user-points'>A temperatura será de <b>{props.bestTime.temp}ºC</b></p>
                </div>
            </div>)}
        </div>
    );
}