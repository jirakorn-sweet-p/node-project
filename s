
router.post('/request-teacher/update', async (req,res) => {
    
    var std_info = (await student_info.find({'student_code':req.body.student_code})).at(0);
    var com_info = (await company_info.find({'student_code':req.body.student_code})).at(0);
    var req_info = (await request_info.find({'student_code':req.body.student_code})).at(0);

    console.log(req.body);

    var status1 = req.body.status1;
    var status2 = req.body.status2;
    var status3 = req.body.status3;
    if(!req.body.status1){
        status1  = "0";
    }
    if(!req.body.status2){
        status2  = "0";
    }
    if(!req.body.status3){
        status3  = "0";
    }
    const update_std = {
        $set: {
            name: req.body.name, 
            student_code: req.body.student_code,
            education: req.body.education,
            factory: req.body.factory,
            grade: req.body.grade,
            email: req.body.email,
            phone: req.body.tel,
            comment: req.body.comment1,
            status: status1

        },
    };
    const update_com = {
        $set: {
            start_intern: new Date(req.body.start_intern), 
            end_intern: new Date(req.body.end_intern),
            status: req.body.status2,
            comment: req.body.comment2

        },
    };
    const update_req = {
        $set: {
            comment: req.body.comment3,
            status: status3

        },
    };
    const filter = { _id: std_info._id };

    await std_info.updateOne(filter, update_std);
    console.log(std_info);
    // if(req.body.start_intern != com_info.start_intern){std_info.com_info=new Date(req.body.start_intern);}
    // if(req.body.end_intern != com_info.end_intern){std_info.com_info.end_intern=new Date(req.body.end_intern);}
    // if(req.body.comment2 != com_info.comment){com_info.comment=req.body.comment2;}
    // if(req.body.status2 != com_info.status){com_info.status=req.body.status2;}
    // if(req.body.comment3 != req_info.comment){req_info.comment=req.body.comment3;}
    // if(req.body.status3 != req_info.status){req_info.status=req.body.status3;}
    await std_info.save();
    // await com_info.save();
    // await req_info.save();
    res.redirect('/request-teacher');
});
