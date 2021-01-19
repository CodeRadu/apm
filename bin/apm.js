#!/usr/bin/env node

const { exec } = require('child_process')
const http=require('http')
const args=process.argv.splice(2)
const {createWriteStream}=require('fs')
const LOCAL_VER='0.0.11'
const path=require('path')
const appdir=path.dirname(require.main.filename)

if(args[0]=='install'){
    if(args[1]!=null){
        console.log(`Searching for ${args[1]}`)
        const options={
            host: 'home.venovedo.ro',
            port: 80,
            path: `/get/${args[1]}`,
            method: 'GET'
        }
        callback=function(response){
            let str=''
            response.on('data', chunk=>{
                str+=chunk
            })
            response.on('end', ()=>{
                if(str!='notfound'){
                    console.log(`Installing ${str}`)
                    exec(`npm i ${str}`)
                }
                else {
                    console.log("Package not found")
                }
            })
        }
        http.request(options, callback).end()
    }
    else console.log('Not enough args')
}
else if(args[0]=='uninstall'){
    if(args[1]!=null){
        console.log(`Searching for ${args[1]}`)
        const options={
            host: 'home.venovedo.ro',
            port: 80,
            path: `/get/${args[1]}`,
            method: 'GET'
        }
        callback=function(response){
            let str=''
            response.on('data', chunk=>{
                str+=chunk
            })
            response.on('end', ()=>{
                if(str!='notfound'){
                    console.log(`Uninstalling ${str}`)
                    exec(`npm r ${str}`)
                }
                else {
                    console.log("Package not found")
                }
            })
        }
        http.request(options, callback).end()
    }
    else console.log('Not enough args')
}
else if(args[0]=='publish'){
    if(args[1]!=null){
        if(args[2]!=null){
            const array=args[2].split('+')
            let arg=''
            array.forEach(e=>{
                arg+=e
                arg+=' '
            })
            console.log(`Publishing ${arg} as ${args[1]}`)
            const options={
                host: 'home.venovedo.ro',
                port: 80,
                path: `/publish?name=${args[1]}&content=${args[2]}`,
                method: 'POST'
            }
            callback=function(response){
                response.on('end', ()=>{
                    console.log('Published')
                })
            }
            http.request(options, callback).end()
        }
        else console.log('Not enough args')
    }
    else console.log('Not enough args')
}
else if(args[0]=='unpublish'){
    if(args[1]!=null){
        console.log(`Unpublishing ${args[1]}`)
        const options={
            host: 'home.venovedo.ro',
            port: 80,
            path: `/unpublish?name=${args[1]}`,
            method: 'POST'
        }
        callback=function(response){
            response.on('end', ()=>{
                console.log('Unublished')
            })
        }
        http.request(options, callback).end()
    }
    else console.log('Not enough args')
}
else if(args[0]=='update'){
    console.log(`Searching for updates`)
    const options={
        host: 'home.venovedo.ro',
        port: 80,
        path: `/ver`,
        method: 'GET'
    }
    callback=function(response){
        let str=''
        response.on('data', chunk=>{
            str+=chunk
        })
        response.on('end', ()=>{
            if(str!=LOCAL_VER){
                console.log('Downloading update')
                const file=createWriteStream(`${appdir}/../download.zip`)
                const request=http.get("http://home.venovedo.ro/download.zip", response=>{
                    response.pipe(file)
                })
                console.log('Installing update')
                exec(`unzip -o ${appdir}/../download.zip -d ${appdir}/../`)
                console.log('Update installed')
                exec(`rm ${appdir}/../download.zip`)
            }
            else console.log('Up to date')
        })
    }
    http.request(options, callback).end()
}
else console.log("Works")