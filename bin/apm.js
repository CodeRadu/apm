#!/usr/bin/env node

const { exec } = require('child_process')
const http=require('http')
const args=process.argv.splice(2)

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
    }
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
}
else console.log("Works")