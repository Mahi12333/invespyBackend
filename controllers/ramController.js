import asyncHandler from 'express-async-handler';

import Myfeeds from '../models/myfeedsModel.js';
import { Material, Place, Amenity, Commission,ProjectAmenity, HomeBannerSlider, HomeSchema, MyFeeds, Offer, Payment, ProjectDesignType, Project, User } from '../models/index.js';
import UserLikes from '../models/likeModel.js';


const myfeeds = asyncHandler(async (req, res) => {
    for (const file of req.files){ 
        let filePath = file.path.replace(/\\/g, '/');   
        const user = await MyFeeds.create({
            project_name:req.body.project_name, 
            caption:req.body.caption, 
            project_type:req.body.project_type, 
            highlight:req.body.highlight, 
            link:req.body.link, 
            assets_banner:filePath
        });
    }
    res.status(201).json({ message: 'Data Submitted successfully' });    
});

const GetMyFeeds = asyncHandler(async (req, res)=>{
    const MyfeedsData = await MyFeeds.findAll({ where: {'status':'1', 'is_publish':'1'} },{order: [['id', 'ASC']]});
    
    if(MyfeedsData)
    {
        res.status(200).json({message: 'All Data List.', data:MyfeedsData });
    }
    else{
        res.status(403).json({ message: 'data is not available' });
    }

});

const GetMyFeedsDraft = asyncHandler(async (req, res)=>{
    const MyfeedsData = await MyFeeds.findAll({ where: {'status':'1', 'is_publish':'0'} },{order: [['id', 'ASC']]});
    //const MyfeedsData = await Myfeeds.findAll({order: [['id', 'ASC']]});
    if(MyfeedsData)
    {
        res.status(200).json({message: 'All Data List.', data:MyfeedsData });
    }
    else{
        res.status(403).json({ message: 'data is not available' });
    }

});
const homeBannerSliders = asyncHandler(async (req, res) => {
    for (const file of req.files){ 
        let filePath = file.path.replace(/\\/g, '/');
        console.log(file);   
        const user = await HomeBannerSlider.create({
            banner_title:req.body.banner_title, 
            images_name:file.filename,
            images_path:filePath
        });
    }
    res.status(201).json({ message: 'Slider home banner Submitted successfully' });    
});
const getHomeBannerSlider=asyncHandler(async(req, res)=>{
    const MybannserData = await HomeBannerSlider.findAll({ where: {'is_active':'1'} },{order: [['id', 'ASC']]});
    //const MyfeedsData = await Myfeeds.findAll({order: [['id', 'ASC']]});
    if(MybannserData)
    {
        res.status(200).json({message: 'All Data List.', data:MybannserData });
    }
    else{
        res.status(403).json({ message: 'data is not available' });
    }
});
const AddLikesFeeds = asyncHandler(async(req, res)=>{
    const user_id = req.body.user_id ? req.body.user_id : '';
    const project_id = req.body.project_id ? req.body.project_id : '';
    if(!user_id)
    {
        res.status(403).json({ message: 'User ID Mandatory.' });
    }
    if(!project_id)
    {
        res.status(403).json({ message: 'Project ID Mandatory.' });
    }
    const checklike = await UserLikes.findOne({where: {'user_id':user_id, 'pid':project_id, 'type':'feeds'}});
    if(checklike)
    {
        await UserLikes.destroy({where:{'user_id':user_id, 'pid':project_id, 'type':'feeds'}});
        res.status(200).json({message: 'Unlike.'});
    }
    else{
        const user = await UserLikes.create({
            user_id:user_id, 
            pid:project_id,
            type:'feeds'
        });
        res.status(200).json({message: 'Like.'});
    }
    
});

export {
    myfeeds,
    GetMyFeeds,
    GetMyFeedsDraft,
    homeBannerSliders,
    getHomeBannerSlider,
    AddLikesFeeds
}