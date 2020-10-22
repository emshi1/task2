"use strict";

function readFile(input) {
    let file = input.files[0];

    let reader = new FileReader();

    reader.readAsText(file);

    reader.onload = function () {
        console.log(reader.result);
        parse(reader.result);
    };
    document.body.innerHTML = ""; 

    reader.onerror = function () {
        console.log(reader.error);
    };
    
}

function parse(file) {
    let value = JSON.parse(file);
    console.log(value);
    createElem(value);
}

function createElem(obj) {
    let br = document.createElement('br');

    let reset = document.createElement('button');
    reset.setAttribute('onclick', 'resetBut()');
    reset.setAttribute('class', 'reset');
    reset.textContent = 'Reset';

    

    for (let key in obj) {
        switch (key) {
            case "fields":
                createFields(obj[key]);
                document.body.appendChild(br);
                break;
            case "references":
                createRef(obj[key]);
                document.body.appendChild(br);
                break;
            case "buttons":
                document.body.appendChild(br);
                createButtons(obj[key]);
                document.body.appendChild(br);
                break;
            default:
                break;
        }
    }
    
    document.body.prepend(reset);
    setStyle();
}

function createFields(obj) {
    for (let key in obj) {
        fFields((obj[key]));
    }
}

function fFields(obj) {
    let br = document.createElement('br');
    let myLabel = document.createElement('label');
    let myForm = document.createElement('form');
    let myInput = document.createElement('input');
    let values = Object.values(obj);

    console.log(values);

    for (let i in values) {
        if (typeof (values[i]) == "string")
            myLabel.textContent = values[i] + '\n';
        else {
            for (let key in values[i]){
                if (key == "filetype") {
                    myInput.setAttribute("accept", "image/png, image/jpeg, image/pdf");
                }
                switch ((values[i])[key]){
                    case "color":
                        myInput =document.createElement('select');
                        createSelect(myInput, values[i]);
                        createInputColor();
                        break;
                    case "technology":
                        myInput =document.createElement('select');
                        createSelect(myInput, values[i]);
                        break;
                    case "checkbox":
                        myInput.setAttribute(key, (values[i])[key]);
                        myInput.setAttribute('onchange', 'checkboxChange()');
                        break;
                    case "textarea":
                        myInput = document.createElement('textarea');
                        myInput.setAttribute(key, (values[i])[key]);
                        break;
                    default:
                        checkMask(key, (values[i])[key], myInput);
                        myInput.setAttribute(key, (values[i])[key]);
                } 
            }
        }
        //document.body.appendChild(br);
    }
    
    myLabel.appendChild(myInput);
    if (myInput.tagName == 'SELECT') {
        myForm.appendChild(myLabel);
        document.body.prepend(myForm);
    } else
        document.body.appendChild(myLabel);
    
        document.body.appendChild(br);
}


let count = 0;

function checkMask(attr, maskValue, elem){
    if (attr === 'mask'){
        count++;
        elem.removeAttribute('type', 'number');
        elem.setAttribute("type", "text");
        elem.setAttribute("class", "jqMask" + count);
        $(elem).mask(maskValue);
    }
}

function createSelect(elem, attr){
    let option = [];
    let i = 0;
    for (let key in attr){
        if (key == 'technologies' || key == 'colors'){
            for (i in attr[key]){
            option[i]=document.createElement('option');
            option[i].setAttribute('value', (attr[key])[i]);
            option[i].textContent=(attr[key])[i];
            elem.appendChild(option[i]);
            }
            
            if (key == 'colors') {
                elem.setAttribute('class', 'select');
                elem.setAttribute('onchange', 'changeColor()');
                console.log(i);
                option[i+1]=document.createElement('option');
                option[i+1].setAttribute('value', 'showColor');
                option[i+1].textContent="Choose your color";

                elem.appendChild(option[i+1]);

            }
        }
    }
    document.body.appendChild(elem);

    
}

function createInputColor(){
    let myInp = document.createElement('input');
                myInp.setAttribute('type', 'color');
                myInp.setAttribute('onchange', 'selectColor()');
                myInp.style.display='none';
                myInp.style.width='20%';
                
                document.body.appendChild(myInp);
}

function selectColor (){
    let inp = document.querySelector('input');
    document.body.style.background=inp.value;
}

function changeColor(){
    let sel = document.querySelector('select');
    console.log(sel.value);
    if (sel.value == 'showColor'){
        let inp = document.querySelector('input');
        inp.style.display='inline';
    } else
        document.body.style.background=sel.value;
}

function createRef(obj) {
    for (let key in obj)
        fRef(obj[key]);
}

function fRef(obj) {
    let myRef = document.createElement('a');
    let br = document.createElement('br');

    for (let key in obj) {
        if (key === "text")
            myRef.textContent = obj[key];
        else if (key === "input") {
            myRef = document.createElement('input');
            for (let i in obj[key])
                myRef.setAttribute(i, (obj[key])[i]);
        }
        else if (key === "ref")
            myRef.setAttribute("href", obj[key]);
        else if (key === "text without ref") {
            let textNode = document.createElement('span');
            textNode.textContent = obj[key] + ' ';
            document.body.appendChild(textNode);
        }
    }
    document.body.appendChild(myRef);
    document.body.appendChild(br);
    
}

function createButtons(obj) {
    for (let key in obj)
        fButtons(obj[key]);
}

function fButtons(obj) {

    let myButt = document.createElement('button');

    for (let key in obj) {
        if (key === "text"){
            myButt.textContent = obj[key];
        }
        else
            myButt.setAttribute(key, obj[key]);

    }
    document.body.appendChild(myButt);
}

function resetBut(){
    document.body.innerHTML = ""; 
    let firstInput = document.createElement('input');
    firstInput.setAttribute('type', 'file');
    firstInput.setAttribute('onchange', 'readFile(this)');
    firstInput.classList.add('form-control');
    document.body.appendChild(firstInput);
}

function setStyle(){
    let sel = document.querySelectorAll('select');
    let but = document.querySelectorAll('button');
    let inp = document.querySelectorAll('input');
    let i;
    for (i = 0; i<sel.length; i++)
        sel[i].classList.add('custom-select');

    for (i = 0; i<but.length; i++){
        but[i].classList.add('btn-primary');
        but[i].classList.add('btn');
    }

    for (i = 0; i<inp.length; i++){
        inp[i].classList.add('form-control');
        if (inp[i].getAttribute('type') == 'checkbox')
            inp[i].classList.remove('form-control');
    }

}

function checkboxChange() {
    document.body.style.background = ('#e4f2ff');
}