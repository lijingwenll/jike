let currentToken = null;
let currentAttribute = null;

function emit(token){
    if(token.type !="text")
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
        emit({
            type:'text',
            content:c
        });
        return;
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
    }else if (c=="/" || c==">"|| c==EOF){
        return afterAttributeName;
    }else if(c=="="){
        // return beforeAttributeName;
    }else{
        currentAttribute={
            name:'',
            value:''
        }
        return attributeName;
    }
}
function attributeName(c){
    if(c.match(/^[\t\n\f ]$/) || c=="/" || c==">"|| c==EOF){
        return afterAttributeName;
    }else if(c=="="){
        return beforeAttributeName;
    }else if(c=="\u0000"){
      
    }else if (c=="/" || c==">"|| c==EOF){

    }else{
        currentAttribute.name +=c;
        return attributeName;
    }
}

function  beforeAttributeValue(c){
    if(c.match(/^[\t\n\f ]$/) || c=="/" || c==">"|| c==EOF){
        return beforeAttributeValue;
    }else if(c=="\""){
        return doubleQuotedAttributeValue;
    }else if(c=="\'"){
        return singleQuotedAttributeValue;
      
    }else if (c==">"){

    }else{
        return UnquotedAttributeValue(c);
    }
}

function doubleQuotedAttributeValue (c){
 if(c=="\""){
    currentToken[currentAttribute.name]= currentAttribute.value;
    return afterQuotedAttributeValue;
 }else if(c =='\u0000'){

 }else if(c == EOF){

 }else{
     currentAttribute.value+=c;
     return doubleQuotedAttributeValue
 }
}

function singleQuotedAttributeValue(c){
    if(c=="\""){
        currentToken[currentAttribute.name]= currentAttribute.value;
        return afterQuotedAttributeValue;
     }else if(c =='\u0000'){
    
     }else if(c == EOF){
    
     }else{
         currentAttribute.value+=c;
         return doubleQuotedAttributeValue
     }
}
function afterQuotedAttributeValue(c){
    if(c.match(/^[\t\n\f ]$/)){
        return beforeAttributeValue;
    }else if(c=="/"){
        return selfClosingStartTag;
    }else if(c==">"){
        currentToken[currentAttribute.name]= currentAttribute.value;
        emit(currentToken);
        return data;
      
    }else if (c==EOF){

    }else{
        currentAttribute.value+=c;
        return doubleQuotedAttributeValue;
    }
}
function UnquotedAttributeValue(c){
    if(c.match(/^[\t\n\f ]$/)){
        currentToken[currentAttribute.name]= currentAttribute.value;
        return beforeAttributeName;
    }else if(c=="/"){
        currentToken[currentAttribute.name]= currentAttribute.value;
        return selfClosingStartTag;
    }else if(c==">"){
        currentToken[currentAttribute.name]= currentAttribute.value;
        emit(currentToken);
        return data;
      
    }else if (c=="\u0000"){

    }else if (c=="\"" || c=="'" ||c=="<" ||c=="=" ||c=="`" ){
        
    }else if (c==EOF){

    }else{
        currentAttribute.value+=c;
        return UnquotedAttributeValue;
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

function selfClosingStartTag(c){
    if(c==">"){
        currentToken.isSelfClosing = true;
        emit(currentToken);
        return data;
    }else if(c=='EOF'){

    }else{
        
    }
}

function  afterAttributeName(){
    if(c.match(/^[\t\n\f ]$/)){
        return afterAttributeName;
    }else if(c=="/"){
        return selfClosingStartTag;
    }else if(c== "="){
        return beforeAttributeValue;
    }else if(c== ">"){
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    }else if(c== EOF){


    }else{
        currentToken[currentAttribute.name] = currentAttribute.value;
        currentAttribute ={
            name:'',
            value:''
        } 
        return attributeName(c);
    }
}

module.exports.parseHtml = function parseHtml(html){
    let state = data;
    for(let c of html){
    state = data(c);
    }
    state = state(EOF)
}
