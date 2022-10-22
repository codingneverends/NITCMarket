<?php
$_origin="localhost";
$username="root";
$password="";
$databasename="nitcmarket";
$upload_folder_path='D:/Xampp/htdocs/NITCMarket/storage/'; 
$loacal_storage_url="http://localhost/NITCMarket/";
$upload_relative_path = $loacal_storage_url."storage/";

$db=new mysqli($_origin,$username,$password,$databasename);
if($db->connect_error){
    die("Connection failure : " .$db->connect_error);
}
$result=array();

$final_result=array();

function checkmail($db,$email){
    $sql="SELECT COUNT(*) AS `count` FROM `users` WHERE `email`='".$email."'";
    $result=$db->query($sql);
    $data=mysqli_fetch_assoc($result);
    return $data['count']==0;
}
function gen_ran_uuid($db,$tablename,$primarykey){
    $ran=rand(0,1000000);
    $sql="SELECT COUNT(*) AS `count` FROM `".$tablename."` WHERE `".$primarykey."`=$ran";
    $result=$db->query($sql);
    $data=mysqli_fetch_assoc($result);
    if($data['count']!=0){
        return gen_ran_uuid($db,$tablename,$primarykey);
    }
    return $ran;
}
function IsAdmin($db,$uuid){
    $sql="SELECT * FROM `users` WHERE `uuid`=$uuid";
    $result=$db->query($sql);
    if($result){
        $data=mysqli_fetch_assoc($result);
        if($data["role"]=="admin")
            return 1;
    }
    return 0;
}
//Logs users in

$_get=isset($_POST['status']) ? true : false;
if($_get)
{
    $act=$_POST['status'];
    if($act=="reguser"){
        $ran=gen_ran_uuid($db,"users","uuid");
        $email=$_POST['email'];
        $password=$_POST['password'];
        $name=$_POST["name"];
        $phno=$_POST["phno"];
        $final_result['email']=$email;
        $final_result['name']=$name;
        $final_result['role']="user";
        $final_result['phno']=$phno;
        if(!checkmail($db,$email)){
            $final_result['error']='mail exists';
        }
        else
        {
            $sql="INSERT INTO `users`(`uuid`, `name`, `email`, `password`, `phno`) VALUES ($ran,'".$name."','".$email."','".$password."','".$phno."')";
            $final_result['user_created']=$db->query($sql);
            $final_result['uuid']=$ran;
        }
    }
    if($act=="getuser"){
        $uuid=$_POST['uuid'];
        $sql="SELECT * FROM `users` WHERE `uuid`=$uuid";
        $result=$db->query($sql);
        $data=mysqli_fetch_assoc($result);
        $data["password"]="oops";
        $final_result=$data;
    }
    if($act=="login"){
        $email=$_POST["email"];
        $passsword=$_POST["password"];
        $sql="SELECT * FROM `users` WHERE `email`='".$email."' AND `password`='".$passsword."'";
        $result=$db->query($sql);
        $data=mysqli_fetch_assoc($result);
        if($data){
            $data["password"]="oops";
            $final_result=$data;
        }
        else{
            $final_result = "error";
        }
    }
    if($act=="updateimg"){
        $uuid=(int)$_POST['uuid']; 
        if($_FILES['image'])
        {
            $avatar_name = $_FILES["image"]["name"];
            $avatar_tmp_name = $_FILES["image"]["tmp_name"];
            $error = $_FILES["image"]["error"];
        
            if($error > 0){
                $response = array(
                    "status" => "error",
                    "error" => true,
                    "message" => "Error uploading the file!"
                );
            }else 
            {
                $upload_name =  $upload_folder_path."profilepic".$uuid.$_POST["name"];
                if(move_uploaded_file($avatar_tmp_name , $upload_name)) {
                    $response = array(
                        "status" => "success",
                        "error" => false,
                        "message" => "File uploaded successfully"
                      );
                      $url=$upload_relative_path."profilepic".$uuid.$_POST["name"];
                      $sql="UPDATE `users` SET `imgurl`='".$url."' WHERE `uuid`=$uuid"; 
                      $result_up=$db->query($sql);
                      $sql="SELECT * FROM `users` WHERE `uuid`=$uuid";
                      $result=$db->query($sql);
                      $data=mysqli_fetch_assoc($result);
                      $final_result["userdata"]=$data;
                      $final_result['image_updated']=$result_up;
                }else
                {
                    $response = array(
                        "status" => "error",
                        "error" => true,
                        "message" => "Error uploading the file!"
                    );
                }
            }
            $final_result['response']=$response;
        }else{
            $response = array(
                "status" => "error",
                "error" => true,
                "message" => "No file was sent!"
            );
        }       
    }
    if($act=="specificuserdata"){
        $uuid=$_POST["uuid"];
        $sql="SELECT * FROM `users` WHERE `uuid`=$uuid";
        $result=$db->query($sql);
        $data=mysqli_fetch_assoc($result);
        $data["password"]="oops";
        $final_result=$data;
    }
    if($act=="postitem"){
        $uuid=(int)$_POST["uuid"];
        $title=$_POST["title"];
        $description=$_POST["description"];
        $cost=$_POST["cost"];
        $item_uuid = gen_ran_uuid($db,"items","uuid");
        $query = sprintf("INSERT INTO `items`(`name`, `description`, `cost`,`uuid`,`userid`) VALUES ('%s','%s','%s',$item_uuid,$uuid)",
            $db -> real_escape_string($title),$db -> real_escape_string($description),$db -> real_escape_string($cost));
        $result=$db->query($query);
        $final_result["sql_additem"]=$result;

        if($_FILES['files'] && $result)
        {
            $total_images = count($_FILES['files']['name']);
            for( $i=0 ; $i < $total_images ; $i++ ) {
                $tmpFilePath = $_FILES['files']['tmp_name'][$i];
                if ($tmpFilePath != ""){
                    $splits = preg_split("/\./",$_FILES['files']['name'][$i]);
                    $ext = $splits[count($splits)-1];
                    $newFilePath = $upload_folder_path."img".$i."uuid".$item_uuid.".".$ext;
                    $newFilePath_relative = $upload_relative_path."img".$i."uuid".$item_uuid.".".$ext;
                    if(move_uploaded_file($tmpFilePath, $newFilePath)) {
                        $temp_uuid = gen_ran_uuid($db,"photos","uuid");
                        $query = sprintf("INSERT INTO `photos` (`uuid`, `itemid`, `imglink`) VALUES ($temp_uuid,$item_uuid,'%s')",
                            $db -> real_escape_string($newFilePath_relative));
                        $result=$db->query($query);
                        $final_result["images_uploaded"][$i]="success";
                        $final_result["images_uploaded_linkadded"][$i]=$result;
                    }
                    else{
                        $final_result["images_uploaded"][$i]="failed";
                        $final_result["images_uploaded_linkadded"][$i]="nil";
                    }
                }
            }
        }else{
            $final_result["images_uploaded"] = array(
                "status" => "error",
                "error" => true,
                "message" => "No file was sent!"
            );
        }        
    }
    if($act=="getitems"){
        $sql="SELECT * FROM `items` WHERE `sold`=0";
        $result=$db->query($sql);
        if($result){
            $i=0;
            while($row=mysqli_fetch_assoc($result)){
                $final_result[$i]=$row;
                $item_id = $row["uuid"];
                $sql="SELECT `imglink` FROM `photos` WHERE `itemid`=$item_id";
                $temp_result=$db->query($sql);
                $final_result[$i]['imglink']=mysqli_fetch_assoc($temp_result)["imglink"];
                $sql="SELECT COUNT(*) as `count` FROM `claims` WHERE `itemid`=$item_id";
                $temp_result=$db->query($sql);
                $final_result[$i]['count']=mysqli_fetch_assoc($temp_result)["count"];
                $i++;
            }
        }
    }
    if($act=="myposts"){
        $uuid=(int)$_POST["uuid"];
        $sql="SELECT * FROM `items` WHERE `userid`=$uuid";
        $result=$db->query($sql);
        if($result){
            $i=0;
            while($row=mysqli_fetch_assoc($result)){
                $final_result[$i]=$row;
                $item_id = $row["uuid"];
                $sql="SELECT `imglink` FROM `photos` WHERE `itemid`=$item_id";
                $temp_result=$db->query($sql);
                $final_result[$i]['imglink']=mysqli_fetch_assoc($temp_result)["imglink"];
                $sql="SELECT COUNT(*) as `count` FROM `claims` WHERE `itemid`=$item_id";
                $temp_result=$db->query($sql);
                $final_result[$i]['count']=mysqli_fetch_assoc($temp_result)["count"];
                $i++;
            }
        }
    }
    if($act=="getitem_fd"){
        $uuid=(int)$_POST["uuid"];
        $item_uuid=(int)$_POST["item_uuid"];
        $sql="SELECT * FROM `items` WHERE uuid=$item_uuid";
        $result=$db->query($sql);
        if($result){
            $final_result["item_details"]=mysqli_fetch_assoc($result);
            $item_uuid = $final_result["item_details"]["uuid"];
            $sql = "SELECT * FROM `photos` WHERE `itemid`=$item_uuid";
            $result=$db->query($sql);
            if($result){
                $i=0;
                while($row=mysqli_fetch_assoc($result)){
                    $final_result["images"][$i]=$row["imglink"];
                    $i++;
                }
            }
            $posterid=$final_result["item_details"]["userid"];
            $sql = "SELECT `uuid`,`name` FROM `users` WHERE `uuid`=$posterid";
            $result=$db->query($sql);
            $final_result["poster"]=mysqli_fetch_assoc($result);
            $sql="SELECT COUNT(*) as `count` FROM `claims` WHERE `itemid`=$item_uuid";
            $result=$db->query($sql);
            $final_result["item_details"]["count"]=mysqli_fetch_assoc($result)["count"];
            $sql="SELECT * FROM `claims` WHERE `itemid`=$item_uuid and `userid`=$uuid";
            $result=$db->query($sql);
            $final_result["item_details"]["mycount"]=0;
            if($row=mysqli_fetch_assoc($result)){
                $final_result["item_details"]['mycount']=$row;
            }
        }
        else{
            $final_result["place_details"]=[];
        }
    }
    if($act=="searchitem"){
        $string=$_POST['string'];
        $sql="SELECT * FROM `items` WHERE `sold`=0 AND `name` LIKE '%$string%'";
        $result=$db->query($sql);
        if($result){
            $i=0;
            while($row=mysqli_fetch_assoc($result)){
                $final_result[$i]=$row;
                $item_id = $row["uuid"];
                $sql="SELECT `imglink` FROM `photos` WHERE `itemid`=$item_id";
                $temp_result=$db->query($sql);
                $final_result[$i]['imglink']=mysqli_fetch_assoc($temp_result)["imglink"];
                $sql="SELECT COUNT(*) as `count` FROM `claims` WHERE `itemid`=$item_id";
                $temp_result=$db->query($sql);
                $final_result[$i]['count']=mysqli_fetch_assoc($temp_result)["count"];
                $i++;
            }
        }
    }
    if($act=="claimitem"){
        $uuid=$_POST["uuid"];
        $item_id = $_POST["item_id"];
        $sql="INSERT INTO `claims`(`itemid`, `userid`) VALUES ($item_id,$uuid)";
        $result=$db->query($sql);
        $final_result = $result;
    }
    if($act=="getclaimers"){
        $uuid=$_POST["uuid"];
        $item_id = $_POST["item_uuid"];
        $sql="SELECT * FROM `items` WHERE `uuid`=$item_id";
        $result=$db->query($sql);
        if(mysqli_fetch_assoc($result)["userid"]==$uuid){
            $sql="SELECT `userid`,`name`,`status` FROM `claims` INNER JOIN `users` ON `claims`.`userid`=`users`.`uuid` WHERE `itemid`=$item_id";
            $result=$db->query($sql);
            $i=0;
            while($row=mysqli_fetch_assoc($result)){
                $final_result[$i]=$row;
            }
            $i++;
        }
    }
    if($act=="removeclaimitem"){
        $uuid=$_POST["uuid"];
        $item_id = $_POST["item_id"];
        $sql="SELECT * FROM `claims` WHERE `itemid`=$item_id and $uuid = `userid`";
        $result=$db->query($sql);
        $row=mysqli_fetch_assoc($result);
        if($row["status"]!="accepted"){
            $sql="DELETE FROM `claims` WHERE `itemid`=$item_id and $uuid = `userid`";
            $result=$db->query($sql);
            $final_result = $result;
        }else{
            $final_result["error"] ="accepted";
        }
    }
    if($act=="deleteitem"){
        //Complete later
        $uuid=$_POST["uuid"];
        $item_id = $_POST["item_id"];
        $sql="SELECT * FROM `items` WHERE `uuid`=$item_id";
        $result=$db->query($sql);
        $data=mysqli_fetch_assoc($result);
        if(IsAdmin($db,$uuid) || $uuid==$data["userid"]){
            $sql="DELETE FROM `photos` WHERE `itemid`=$item_id";
            $result=$db->query($sql);
            //Can be added photo deleting cde from server
            $sql="DELETE FROM `claims` WHERE `itemid`=$item_id";
            $result=$db->query($sql);
            $sql="DELETE FROM `items` WHERE `uuid`=$item_id";
            $result=$db->query($sql);
        }
        $final_result=$result;
    }
    if($act=="acceptclaim" || $act=="rejectclaim" || $act=="nullclaim"){
        $claimstatus='';
        if($act=="rejectclaim"){
            $claimstatus="rejected";
        }
        if($act=="acceptclaim"){
            $claimstatus="accepted";
        }
        if($act=="nullclaim"){
            $claimstatus="not decided";
        }
        $uuid=$_POST["uuid"];
        if(IsAdmin($db,$uuid)){
            $item_id = $_POST["item_id"];
            $user_id = $_POST["user_id"];
            $sql="UPDATE `claims` SET `status`='".$claimstatus."' WHERE `itemid`=$item_id AND `userid`=$user_id";
            $result=$db->query($sql);
            $final_result=$result;
        }
        else
            $final_result="Need Elevated Priviliages";
    }
    if($act=="deleteuser"){
        $uuid=$_POST["uuid"];
        $user_id = $_POST["user_id"];
        if(IsAdmin($db,$uuid) && $uuid!=$user_id){
            $sql="DELETE FROM `claims` WHERE `user_id`=$user_id";
            $result=$db->query($sql);
            $sql="SELECT * FROM `items` WHERE `userid`=$user_id";
            $result=$db->query($sql);
            if($result){
                while($row=mysqli_fetch_assoc($result)){
                    $item_id = $row["uuid"];
                    $sql="DELETE FROM `claims` WHERE `itemid`=$item_id";
                    $result=$db->query($sql);
                    $sql="DELETE FROM `photos` WHERE `itemid`=$item_id";
                    $result=$db->query($sql);
                }
            }
            $sql="DELETE FROM `users` WHERE `uuid`=$user_id";
            $result=$db->query($sql);
        }
    }
}


$db->close();

header('Access-Control-Allow-Origins: *');
header('Content-Type: appilication/json');
header("Access-Control-Allow-Methods: PUT, GET, POST");
echo json_encode($final_result);

?>