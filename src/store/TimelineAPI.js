import PubSub from 'pubsub-js';
export default class TimelineAPI{

    constructor(fotos){
        this.fotos = fotos
    }

    like(fotoId){
        fetch(`http://localhost:8080/api/fotos/${fotoId}/like?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`, {method: 'POST'})
        .then((res)=> res.json())
        .then((liker)=>{
          const fotoEncontrada = this.fotos.find((foto)=>{
            if(foto.id == fotoId){
              return foto;
            }
          });
          fotoEncontrada.likeada = !fotoEncontrada.likeada;
          let hasLiker = fotoEncontrada.likers.find((liked)=> liked.login === liker.login ? liked.login : false );
          
          if(hasLiker){
            fotoEncontrada.likers = fotoEncontrada.likers.filter((liked)=> {
              if( liked.login !== hasLiker.login ){
                return liked;
              }
            });
          } else{
            fotoEncontrada.likers = fotoEncontrada.likers.concat(liker);
          }
          PubSub.publish('timeline', this.fotos);
        });
    }

    comenta(fotoId, textoComentario){
        const requestInfo = {
          method:'POST',
          body:JSON.stringify({texto: textoComentario}),
          headers: new Headers({
            'Content-type':'application/json'
          })
        };
        fetch(`http://localhost:8080/api/fotos/${fotoId}/comment?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`, requestInfo)
            .then(response => {
                if(response.ok){
                    return response.json();
                } else {
                    throw new Error("não foi possível comentar");
                }
            })
            .then((novoComentario)=>{
                const fotoEncontrada = this.fotos.find((foto)=>{
                    if(foto.id == fotoId){
                        return foto;
                    }
                });
                fotoEncontrada.comentarios.push(novoComentario) 
                PubSub.publish('timeline', this.fotos);
            })
    }

    lista(urlPerfil){  
        fetch(urlPerfil)
         .then(response => response.json())
         .then(fotos => {         
           this.fotos = fotos;
           PubSub.publish('timeline', this.fotos);
         });      
    }

    subscribe(callback){
        PubSub.subscribe('timeline',(channel, fotos)=> callback(fotos));
    }
}