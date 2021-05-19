let currentToken = null;

function emit(token){
    // if(token.type !="text")
    console.log(token);
}

const EOF = Symbol("EOF");


function data(c){
    if(c=="<"){
        console.log(c,'1')
        return tagOpen;
    }else if(c== EOF){
        emit({
            type:'EOF'
        });
        console.log(c,'2')

        return;
    }else{
        emit({
            type:"text",
            content:c
        });
        console.log(c,'3')

        return data;
    }
}

function tagOpen(c){
    if(c=="/"){
        return endTagOpen;
    }else if(c.match(/^[a-zA-Z]$/)){
        currentToken = {
            type:'startTag',
            tagName:""
        }
        return tagName(c);
    }else{
        return;
    }
}

function endTagOpen(c){
    if(c.match(/^[a-zA-Z]$/)){
        currentTOken ={
            type:"endTag",
            tagName:""
        }
        return tagName(c);
    }else if(c==">"){

    }else if(c== EOF){

    }else{
         
    }
}

function tagName(c){
    if(c.match(/^[\t\n\f ]$/)){
        return beforeAttributeName;
    }else if(c=='/'){
        return selfClosingStartTag;
    }else if(c.match(/^[a-zA-Z]$/)){
        currentToken.tagName += c //.toLowerCase();
        console.log(currentToken,'currentToken')
        return tagName;
    }else if(c==">"){
        emit(currentToken);
        return data;
    }else{
        return tagName;
    }
}

function beforeAttributeName(c){
    if(c.match(/^[\t\n\f ]$/)){
        return beforeAttributeName;
    }else if (c==">"){
        return data;
    }else if(c=="="){
        return beforeAttributeName;
    }else{
        return beforeAttributeName;
    }
}

function selfClosingStartTag(c){
    if(c==">"){
        currentToken.isSelfClosing = true;
    }else if(c=='EOF'){

    }else{
        
    }
}

module.exports.parseHtml = function parseHtml(html){
    let state = data;
    for(let c of html){
    state = data(c);
    }
    state = state(EOF)
}
