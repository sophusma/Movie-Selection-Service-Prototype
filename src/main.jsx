import React,{useState,useEffect,useMemo,useRef} from 'react';
import {createRoot} from 'react-dom/client';
import movies from './movies.json';
import './style.css';

const TRAILERS={714248:'pTJrxcJ4PwU',425:'iJZA3WyeB_E',1040690:'3odOdv25W9k'};
function Trailer({m,still}){const id=TRAILERS[m.id];
 return <div className="trl">{still}{id&&<iframe src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&playsinline=1&rel=0&controls=1`} title={m.title} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen/>}</div>}
const byId=Object.fromEntries(movies.map(m=>[m.id,m]));
const MOODS={'Расслабиться':['анимация','семейный','комедия'],'Подумать':['драма','документальный','искусство','фэнтези'],'Посмеяться':['комедия'],'Пощекотать нервы':['детектив','военный','фэнтези'],'Поплакать':['драма'],'Захватывающее':['детектив','военный','приключения','биографический']};
const Q=[['С кем смотрите?',['Наедине','Вдвоём','С семьёй','С друзьями']],['Что хочется получить?',Object.keys(MOODS)],['Сколько есть времени?',['До 1.5 часа','1.5–2 часа','2+ часа']],['Насколько готовы погружаться?',['Фоном','Обычно','Внимательно','Что-то новое']]];
const tags=m=>Object.keys(MOODS).filter(k=>MOODS[k].some(g=>m.genres.includes(g))).slice(0,2);
const dur=m=>`${Math.floor(m.runtime/60)} ч ${m.runtime%60} мин`;
const REV={425:[['night watcher',8,'12 сентября 2026','Смотрел впервые лет десять назад, и тогда он мне показался просто скучным. Пересмотрел на прошлой неделе — и это было совсем другое кино. Не знаю, что изменилось: я или время. Но теперь я понимаю, почему его называют классикой.\n\nЭто не фильм про чуму и не фильм про шахматы. Это разговор о том, что будет после. И Бергман не даёт ответа — он просто показывает вопрос. Медленно, красиво, беспощадно.\n\nЕсли готов смотреть внимательно — не пожалеешь. Если хочется фона — пройди мимо.'],['alexey85',7,'7 февраля 2026','Не для фона. Но если готов смотреть внимательно — не пожалеешь'],['Владимир',3,'7 января 2025','Ожидал большего. Все говорят "классика", "шедевр", а я два часа смотрел, как люди ходят по полю и разговаривают о смерти. Понял, что не моё, минут через двадцать, но досидел из уважения.']],
1040690:[['Кирилл',8,'12 сентября 2026','Смотрел впервые, ничего не знал заранее — и, наверное, поэтому он так попал. Это не просто ностальгия по пейзажам и скейтам. Это честный разговор о том, как подросток ищет, где ему быть, и находит это в компании таких же потерянных.\n\nДжона Хилл снял кино так, будто нашёл старую кассету в подвале. Плёнка, 4:3, хип-хоп из плеера — всё это не декорация, а способ вернуть тебе то время.\n\nПосле финала долго сидел в тишине.'],['alexey85',7,'7 февраля 2026','Технически сделано интересно: зернистая плёнка, формат 4:3, хип-хоп из плеера. Но по сути весь фильм — как мальчик катается на скейте и тусуется с друзьями. Красиво, но пустовато'],['Владимир',3,'7 января 2025','Ожидал большего. Все говорят "классика", "шедевр", а я два часа смотрел, как люди ходят по полю и разговаривают о смерти.']]};
const ls=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}};

const route=()=>{const h=location.hash.slice(1)||'/';const[p,q]=h.split('?');return{p,q:new URLSearchParams(q||'').get('q')||''}};
const go=h=>{location.hash=h;window.scrollTo(0,0)};

function Header({q}){const[v,setV]=useState(q);useEffect(()=>setV(q),[q]);
 return <header className="hdr"><a className="logo" href="#/">ТВОЙ ВЫБОР</a>
 <nav><a href="#/">Каталог</a><a href="#/list">Мой список</a><a href="#/" onClick={e=>e.preventDefault()}>Профиль</a></nav>
 <label className="search"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="9" cy="9" r="6"/><path d="M14 14l4 4"/></svg>
 <input value={v} placeholder="Название, режиссёр или актёр" onChange={e=>{setV(e.target.value);go(e.target.value?`/search?q=${encodeURIComponent(e.target.value)}`:'/')}}/></label></header>}

const Card=({m,tag})=><a className="card" href={`#/movie/${m.id}`}><img src={m.poster} alt={m.title} loading="lazy"/>{tag&&<span className="tag">{tag}</span>}</a>;
function Row({title,sub,list,children,empty}){return <section className="sec"><h2>{title} <span className="chev">›</span></h2><p className="sub">{sub}</p>
 <div className="row">{children}{list.map(m=><Card key={m.id} m={m} tag={tags(m)[0]}/>)}{!list.length&&!children&&<p className="sub">{empty}</p>}</div></section>}

function Hero({saved,toggle}){const[i,setI]=useState(0);const sl=[byId[1040690],byId[425],byId[714248]];const m=sl[i];
 return <section className="hero"><Trailer key={m.id} m={m} still={m.id===1040690?<img src="/image.png" alt=""/>:<img className="pz" src={m.poster} alt=""/>}/>
 <button className="arr l" onClick={()=>setI((i+2)%3)} aria-label="Назад">‹</button><button className="arr r" onClick={()=>setI((i+1)%3)} aria-label="Вперёд">›</button>
 <div className="hc"><h2>{m.title}</h2><p>{m.logline}</p><div className="btns"><a className="btn grey" href={`#/movie/${m.id}`}>О фильме</a>
 <button className="btn grey sq" onClick={()=>toggle(m.id)} aria-label="Сохранить"><Bm on={saved.includes(m.id)}/></button></div></div></section>}
const Bm=({on})=><svg width="16" height="18" viewBox="0 0 16 18" fill={on?'currentColor':'none'} stroke="currentColor" strokeWidth="1.5"><path d="M3 1.5h10v15l-5-4-5 4z"/></svg>;

function Home({open,saved,toggle,hidden}){const vis=movies.filter(m=>!hidden.includes(m.id));const pick=ids=>ids.map(i=>byId[i]).filter(m=>m&&!hidden.includes(m.id));
 return <main className="pg">
 <section className="banner"><h1>Что посмотрим сегодня?</h1><p>Пара вопросов — и подберём фильм на сегодня</p><button className="btn blue" onClick={open}>Подобрать фильм</button></section>
 <Hero saved={saved} toggle={toggle}/>
 <Row title="Похожие на то, что вам нравится" sub="Фильмы, подобранные на основе просмотренного и сохранённого." list={pick([714248,425,5237750,225011,1259195,6553389])}/>
 <Row title="Выбор эксперта" sub="Что посмотреть, если хочется не просто убить время" list={pick([677566,1347315,1259195,5237750,714248])}>
  <div className="expert"><b>Антон Долин</b><small>Кинокритик</small><p>Есть кино, которое работает всегда — независимо от настроения и компании. Это не самые громкие премьеры, но именно их я ставлю, когда хочу гарантированно хороший вечер. Проверено не раз.</p><img src="/expert-photo.png" alt="Антон Долин"/></div></Row>
 <Row title="Тыквы, свечи и кино" sub="Подборка для Хэллоуина — от лёгкого до жуткого" list={pick([425,425400,225011,714248,677566])}/>
 <Row title="Из вашего списка" sub="Фильмы, которые вы сохранили, но ещё не посмотрели" list={vis.filter(m=>saved.includes(m.id))} empty="Пока пусто — сохраняйте фильмы на их страницах."/>
 <Row title="Когда хочется знакомого" sub="Иногда хочется не нового, а знакомого. Вот список" list={pick([677566,1040690,1347315,5237750,425400,6553389,225011])}/></main>}

function Grid({list,empty}){return list.length?<div className="grid">{list.map(m=><Card key={m.id} m={m}/>)}</div>:<p className="sub">{empty}</p>}

function Picker({ans,setAns,close,done}){
 const pick=(qi,v)=>setAns(a=>{const n=[...a];n[qi]=n[qi]===v?null:v;return n});
 return <div className="ovl" onClick={close}><div className="modal" onClick={e=>e.stopPropagation()}><button className="x" onClick={close} aria-label="Закрыть">✕</button>
 <h1>Подберём фильм на вечер</h1><p className="msub">Что важно — отметьте. Остальное пропустите</p>
 <div className="panel">{Q.map(([t,o],qi)=><div key={t}><h3>{t}</h3><div className="chips">{o.map(v=><button key={v} className={'chip'+(ans[qi]===v?' on':'')} onClick={()=>pick(qi,v)}>{v}</button>)}</div></div>)}
 <button className="btn blue big" onClick={done}>Подобрать</button></div></div></div>}

function match(ans){const[w,m,t,d]=ans;
 const sc=x=>{let s=0;
  if(w==='С семьёй'&&x.genres.some(g=>['семейный','анимация'].includes(g)))s+=3;
  if(w==='С друзьями'&&x.genres.includes('комедия'))s+=2;
  if(w==='Вдвоём'&&x.genres.some(g=>['драма','комедия','биографический'].includes(g)))s+=1;
  if(m&&MOODS[m].some(g=>x.genres.includes(g)))s+=3;
  if(t==='До 1.5 часа'&&x.runtime<=95)s+=2;if(t==='1.5–2 часа'&&x.runtime>90&&x.runtime<=125)s+=2;if(t==='2+ часа'&&x.runtime>=120)s+=2;
  if(d==='Фоном'&&x.genres.some(g=>['комедия','анимация','семейный'].includes(g)))s+=2;
  if(d==='Внимательно'&&x.genres.some(g=>['драма','документальный','военный','искусство'].includes(g)))s+=2;
  if(d==='Что-то новое'&&x.year>=2018)s+=2;return s};
 return[...movies].map(x=>[x,sc(x)]).sort((a,b)=>b[1]-a[1]||b[0].rating-a[0].rating);}

function Result({ans,again,hidden}){const r=match(ans);const any=ans.some(Boolean);
 const list=r.filter(([x,s])=>!hidden.includes(x.id)&&(!any||s>0)).map(([x])=>x);
 return <main className="pg"><h1 className="big">Подобрали для вас</h1><p className="sub lead">На основе ваших ответов. Можно поменять — фильмы обновятся</p>
 <div className="chips">{ans.filter(Boolean).map(v=><span key={v} className="chip">{v}</span>)}</div>
 <button className="btn blue again" onClick={again}>Подобрать ещё раз</button><Grid list={list} empty="Под такие ответы ничего не нашлось — попробуйте изменить их."/></main>}

function Movie({m,saved,toggle,rates,rate,hidden,hide,reviews,addReview}){
 const[more,setMore]=useState(false);const[form,setForm]=useState(false);const[tx,setTx]=useState('');
 const rv=[...(reviews[m.id]||[]),...(REV[m.id]||[])];const shown=more?rv:rv.slice(0,3);
 const sim=movies.filter(x=>x.id!==m.id&&!hidden.includes(x.id)).sort((a,b)=>b.genres.filter(g=>m.genres.includes(g)).length-a.genres.filter(g=>m.genres.includes(g)).length).slice(0,6);
 const crew=[...m.directors.map(n=>[n,'Режиссёр']),...m.cast.map(n=>[n])];
 const pos=rv.filter(r=>r[1]>=7).length,neg=rv.filter(r=>r[1]<=4).length;
 return <main className="pg">
 <section className="mhero"><div className="mi"><div className="mt"><h1>{m.title}</h1>{tags(m).map(t=><span key={t} className="tag big">{t}</span>)}</div>
  <div className="meta"><b>{m.rating.toFixed(1)}</b><span>{m.genres.slice(0,2).join(', ')}</span><i>|</i><span>{m.year}</span><i>|</i><span>{dur(m)}</span><i>|</i><span>{m.country}</span></div>
  <p className="lg">{m.logline}</p>
  <button className="btn grey wide" onClick={()=>toggle(m.id)}>{saved.includes(m.id)?'Сохранено':'Сохранить фильм'} <Bm on={saved.includes(m.id)}/></button>
  <button className="btn line wide" onClick={()=>hide(m.id)}>{hidden.includes(m.id)?'Похожие не предлагаются':'Не предлагать похожие'}</button>
  <div className="rate">{[1,2,3,4,5,6,7,8,9,10].map(n=><button key={n} className={rates[m.id]===n?'on':''} onClick={()=>rate(m.id,n)}>{n}</button>)}</div>
  <small>Чем больше вы оцениваете, тем точнее мы подбираем фильмы под ваш вкус</small></div>
  <div className="still"><Trailer key={m.id} m={m} still={m.id===1040690?<img src="/image.png" alt=""/>:<img className="pz" src={m.poster} alt=""/>}/></div></section>
 <section className="sec"><h2>Съёмочная группа и актёры</h2><div className="crew">{crew.map(([n,r])=><div key={n} className="p"><span className="av">{n.split(' ').map(w=>w[0]).slice(0,2).join('')}</span><b>{n}</b>{r&&<small>{r}</small>}</div>)}</div></section>
 <section className="sec rv"><div className="rl"><h2>Отзывы</h2><p className="cnt">{pos} положительных | {neg} отрицательных | {rv.length-pos-neg} нейтральных</p>
  {!rv.length&&<p className="sub">Отзывов пока нет.</p>}
  {shown.map((r,i)=><article key={i} className="rev"><div className="rh"><span>{r[0]}</span><span className="sc">оценка <b className={r[1]>=7?'g':r[1]<=4?'neg':''}>{r[1]}</b></span></div>   <hr/>{r[3].split("\n\n").map((t,j)=><p key={j}>{t}</p>)}<small>{r[2]}</small></article>)}
  {rv.length>3&&!more&&<button className="btn line more" onClick={()=>setMore(true)}>Показать ещё ⌄</button>}</div>
  <aside className="ra"><img src={m.poster} alt={m.title}/><button className="btn grey wide" onClick={()=>setForm(!form)}>Оставить отзыв ✎</button>
  {form&&<div className="form"><textarea rows="4" placeholder="Ваш отзыв" value={tx} onChange={e=>setTx(e.target.value)}/>
  <button className="btn blue" onClick={()=>{if(!tx.trim())return;addReview(m.id,['Гость',rates[m.id]||7,new Date().toLocaleDateString('ru-RU',{day:'numeric',month:'long',year:'numeric'}),tx]);setTx('');setForm(false)}}>Отправить</button></div>}</aside></section>
 <section className="sec"><h2>Похожие фильмы</h2><div className="row">{sim.map(x=><Card key={x.id} m={x}/>)}</div></section></main>}

function App(){
 const[r,setR]=useState(route());useEffect(()=>{const f=()=>setR(route());addEventListener('hashchange',f);return()=>removeEventListener('hashchange',f)},[]);
 const[saved,setSaved]=useState(()=>ls('saved',[]));const[hidden,setHidden]=useState(()=>ls('hidden',[]));
 const[rates,setRates]=useState(()=>ls('rates',{}));const[reviews,setReviews]=useState(()=>ls('reviews',{}));
 const[ans,setAns]=useState([null,null,null,null]);const[pk,setPk]=useState(false);
 useEffect(()=>{try{localStorage.setItem('saved',JSON.stringify(saved));localStorage.setItem('hidden',JSON.stringify(hidden));localStorage.setItem('rates',JSON.stringify(rates));localStorage.setItem('reviews',JSON.stringify(reviews))}catch{}},[saved,hidden,rates,reviews]);
 const tg=(s,f)=>id=>f(a=>a.includes(id)?a.filter(x=>x!==id):[...a,id]);
 const toggle=tg(saved,setSaved),hide=tg(hidden,setHidden);
 const p=r.p;let page;
 if(p.startsWith('/movie/')&&byId[p.slice(7)])page=<Movie m={byId[p.slice(7)]} saved={saved} toggle={toggle} rates={rates} rate={(id,n)=>setRates(x=>({...x,[id]:n}))} hidden={hidden} hide={hide} reviews={reviews} addReview={(id,rv)=>setReviews(x=>({...x,[id]:[rv,...(x[id]||[])]}))}/>;
 else if(p==='/picked')page=<Result ans={ans} hidden={hidden} again={()=>setPk(true)}/>;
 else if(p==='/search'){const q=r.q.toLowerCase();page=<main className="pg"><h1 className="big">Результаты поиска</h1><p className="sub lead">Запрос: {r.q}</p><Grid empty="Ничего не найдено." list={movies.filter(m=>[m.title,...m.directors,...m.cast].some(s=>s.toLowerCase().includes(q)))}/></main>}
 else if(p==='/list')page=<main className="pg"><h1 className="big">Мой список</h1><p className="sub lead">Фильмы, которые вы сохранили</p><Grid empty="Пока пусто — сохраняйте фильмы на их страницах." list={movies.filter(m=>saved.includes(m.id))}/></main>;
 else page=<Home open={()=>setPk(true)} saved={saved} toggle={toggle} hidden={hidden}/>;
 return <><Header q={p==='/search'?r.q:''}/>{page}{pk&&<Picker ans={ans} setAns={setAns} close={()=>setPk(false)} done={()=>{setPk(false);go('/picked')}}/>}</>}
createRoot(document.getElementById('root')).render(<App/>);
