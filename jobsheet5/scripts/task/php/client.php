<?php

    while (true) {
        $url = "http://python-s:5000/rpc";

        $data = array(
            "jsonrpc" => "2.0",
            "method"  => "sample.subtract", 
            "params"  => array(7, 4),
            "id"      => 2
        );

        $options = array(
            "http" => array(
                "header"  => "Content-Type: application/json\r\n",
                "method"  => "POST",
                "content" => json_encode($data)
            )
        );

        $context = stream_context_create($options);
        $result  = file_get_contents($url, false, $context);

        if ($result === FALSE) {
            echo "Error: Unable to connect to the RPC server.";
        } else {
            echo $result;
        }

    sleep(5);
    }
    
?>