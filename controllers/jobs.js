const { StatusCodes } = require("http-status-codes");
const Job = require("../models/Job");
const { NotFoundError, BadRequestError } = require("../errors");
const getAllJobs = async (req, res) => {
  //give the job of one who logged in
  const userId = await req.user.userId;
  const jobs = await Job.find({
    createdBy: userId,
  }).sort("createdAt");
  return res.status(StatusCodes.OK).json({
    jobs,
    count: jobs.length,
  });
};

const getJob = async (req, res) => {
  //add an extra layer
  const {
    params: { id: jobId },
    user: { userId },
  } = req;
  const job = await Job.findOne({
    _id: jobId,
    createdBy: userId,
  });
  if (!job) {
    throw new NotFoundError(`The job with job id ${jobId} is not found`);
  }
  return res.status(StatusCodes.OK).json({ job });
};

const createJob = async (req, res) => {
  //createdBy
  req.body.createdBy = req.user.userId;
  const job = await Job.create({ ...req.body });
  res.status(StatusCodes.CREATED).json({ job });
};

const updateJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
    body: { position, company },
  } = req;
  //find the job and update
  const job = await Job.findOneAndUpdate({ _id: jobId, createdBy: userId }, req.body, {
    new:true, runValidators:true
  });
  if(!company || !position){
    throw new BadRequestError("Please provide company or position")
  }
  if (!job) {
    throw new NotFoundError(`The job with job id ${jobId} is not found`);
  }
  return res.status(StatusCodes.OK).json({ job });
};

const deleteJob = async (req, res) => {
  const {user: {userId}, params: {id: jobId}} = req;

  const deleteJob = await Job.findByIdAndRemove({_id: jobId,createdBy:userId})

    if (!deleteJob) {
    throw new NotFoundError(`The job with job id ${jobId} is not found`);
  }
  return res.status(StatusCodes.OK).send();
};

module.exports = {
  getAllJobs,
  getJob,
  updateJob,
  deleteJob,
  createJob,
};
