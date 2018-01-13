import React, { Component } from 'react';
import {Link} from 'react-router';

class FotoAtualizacoes extends Component {

    like(event){
      event.preventDefault();
      this.props.like(this.props.foto.id)
    }

    comenta(event){
      event.preventDefault();
      this.props.comenta(this.props.foto.id, this.comentario.value)
    };

    render(){
        return (
            <section className="fotoAtualizacoes">
              <a onClick={this.like.bind(this)} href="#" className={this.props.foto.likeada? 'fotoAtualizacoes-like-ativo': 'fotoAtualizacoes-like' }>Likar</a>
              <form className="fotoAtualizacoes-form" onSubmit={this.comenta.bind(this)}>
                <input type="text" placeholder="Adicione um comentário..." ref={(input)=> this.comentario = input } className="fotoAtualizacoes-form-campo"/>
                <input type="submit" value="Comentar!" className="fotoAtualizacoes-form-submit"/>
              </form>

            </section>            
        );
    }
}

class FotoInfo extends Component {
    render(){
        const {likers, comentarios} = this.props.foto;
        return (
            <div className="foto-in fo">
              <div className="foto-info-likes">
                {
                  likers.map(liker => {
                    return (<Link key={liker.login} href={`/timeline/${liker.login}`}>{liker.login},</Link>)
                  })
                }
                 
                 curtiram
             
              </div>

              <p className="foto-info-legenda">
                <a className="foto-info-autor">autor </a>
                {this.props.foto.comentario}
              </p>

              <ul className="foto-info-comentarios">
                {
                  comentarios.map(comentario => {
                    return (
                      <li className="comentario" key={comentario.id}>
                        <Link to={`/timeline/${comentario.login}`} className="foto-info-autor">{comentario.login} </Link>
                        {comentario.texto}
                      </li>
                    );
                  })
                }
              </ul>
            </div>            
        );
    }
}

class FotoHeader extends Component {
    render(){
        return (
            <header className="foto-header">
              <figure className="foto-usuario">
                <img src={this.props.foto.urlPerfil} alt="foto do usuario"/>
                <figcaption className="foto-usuario">
                  <Link to={`/timeline/${this.props.foto.loginUsuario}`}>
                    {this.props.foto.loginUsuario}
                  </Link>  
                </figcaption>
              </figure>
              <time className="foto-data">{this.props.foto.horario}</time>
            </header>            
        );
    }
}

export default class FotoItem extends Component {
    render(){
        const {foto} = this.props;
        return (
          <div className="foto">
            <FotoHeader foto={foto}/>
            <img alt="foto" className="foto-src" src={foto.urlFoto}/>
            <FotoInfo foto={foto}/>
            <FotoAtualizacoes foto={foto} like={this.props.like} comenta={this.props.comenta}/>
          </div>            
        );
    }
}