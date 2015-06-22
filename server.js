var webPage     = require( "webpage" ) ,
    fs          = require( "fs" ) ,
    content     = [] ,
    log         = [] ,
    logPath     = false ,
    contentPath = false ,
    url         = "http://baidu.com" ,
    count       = 0 ,
    total       = 50;

function E( x ){ return console.log( x ); }

/*!
 *  write log
 *  @str    {string}    info
 */
function writeLog( str ){
    log.push( str );
    if( log.length >= 100 ){
        console.log( "write file into local" );
        fs.write( logPath , log.join( "\r\n" ) + "\r\n" , "a" );
        log.length  = 0;
    }
}

/*!
 *  write content
 *  @str    {string}    info
 */
function writeContent( str ){
    content.push( str );
    if( content.length >= 100 ){
        console.log( "write file into local" );
        fs.write( contentPath , content.join( "\r\n" ) + "\r\n" , "a" );
        content.length  = 0;
    }
}

function Open( url ){
    this.count  = 0;
    this.url    = url;
    this.http   = webPage.create();
}

Open.prototype.openUrl = function(){
    var _date   = new Date().getTime() ,
        _self   = this;
    this.http.open( this.url , function( status ){
        writeLog( ++_self.count + " time open url, status : " + status + " , response time : " + ( new Date().getTime() - _date ) );
        if( status ){
            writeContent( _self.http.plainText );
        }
        _self.openUrl();
    } );
};

/*!
 *  read config
 */
(function(){
    var _config;
    try {
        _config     = JSON.parse( fs.read( "./config.json" ) );
        logPath     = _config.logFile;
        contentPath = _config.contentFile;
        url         = _config.url;
        total       = _config.webkitNum;
    } catch( e ) {
        phantom.exit();
    }
})();

/*!
 *  create webkit to test website
 */
( function(){
    for( var i = total; i--; ){
        new Open( url ).openUrl();
    }
} )();