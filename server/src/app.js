const express = require('express');
const cors = require('cors');
const { InstanceDecoder } = require("./utils/InstanceDecoder");
const { WixOAuthFacade } = require("./tokens/WixOAuthFacade");
// const { StoresApis } = require("./apis/StoresApis");
const { AppApis } = require("./apis/AppApis");
const { WixAuthController } = require("./controllers/WixAuthController");
const { ApiController } = require("./controllers/ApiController");
const { WebhooksController } = require("./controllers/WebhooksController");
const { json, text } = require('body-parser');
const { WebhookDecoderVerifier } = require("./utils/WebhookDecoderVerifier");
const { AppInstallationsService } = require("./services/AppInstallationsService");
// const { LeadsCollectionService } = require("./services/LeadsCollectionService");
// const { ProductOfTheDayService } = require("./services/ProductOfTheDayService");
// const { NedbProductOfTheDayDao } = require("./dao/NedbProductOfTheDayDao");
// const {WixInboxApis} = require("./apis/WixInboxApis");
// const {CouponsApis} = require("./apis/CouponsApis");
const { NedbAppInstallationsDao } = require('./dao/NedbAppInstallationDao');
const { NedbRefreshTokenDao } = require('./dao/NedbRefreshTokenDao');



const startServer = () => {
    const app = express();
    app.use(cors());
    app.use(text());
    app.use(json());
    return app;
}


const createControlers = (app, config) => {
    /*
      APP_ID and APP_SECRET are secrets and you shouldn't share them with anyone!
      Their values resides in .env file and you should NOT COMMIT THEM TO GITHUB!
    */
    const { APP_ID, APP_SECRET, redirectUrl, wixBaseUrl, WEBHOOK_PUBLIC_KEY, wixApiUrl } = config;

    //Helpers
    const instanceDecoder = new InstanceDecoder(APP_SECRET);
    const webhookDecoderVerifier = new WebhookDecoderVerifier(WEBHOOK_PUBLIC_KEY);

    //Databases Dao's
    const refreshTokenDao = new NedbRefreshTokenDao();
    const installationsDao = new NedbAppInstallationsDao();
    // const productOfTheDayDao = new NedbProductOfTheDayDao();
    // const LeadCollectnpmionDao = new NedbLeadCollectionDao();

    //Wix OAUTH
    const wixOAuthFacade = new WixOAuthFacade(APP_ID, APP_SECRET, wixApiUrl);

    //Wix APIs
    // const storesApis = new StoresApis(`${wixApiUrl}/stores/`, refreshTokenDao, wixOAuthFacade)
    const appApis = new AppApis(`${wixApiUrl}/apps/v1`, refreshTokenDao, wixOAuthFacade);
    // const couponsApis = new CouponsApis(`${wixApiUrl}/stores/v2`, refreshTokenDao, wixOAuthFacade);
    // const wixInboxApis = new WixInboxApis(`${wixApiUrl}/inbox/v2`, refreshTokenDao, wixOAuthFacade);

    //App Services
    const installationsService = new AppInstallationsService(installationsDao);
    // const LeadsCollectionService = new LeadsCollectionService(
    //   LeadCollectionDao, 
    //   APP_ID,
    //   productOfTheDayDao, 
    //   wixInboxApis, 
    //   couponsApis, 
    //   storesApis, 
    //   couponsDao
    //   );

    //App controllers
    const wixAuthController = new WixAuthController(APP_ID, wixOAuthFacade, refreshTokenDao, redirectUrl, wixBaseUrl);
    const apiController = new ApiController(instanceDecoder, appApis, installationsService);
    // deleted  LeadsCollectionService productOfTheDayService
    const webhooksController = new WebhooksController(webhookDecoderVerifier, installationsService)
    // deleted productOfTheDayService

    app.use('/auth', wixAuthController.router)
    app.use('/api', apiController.router)
    app.use('/webhooks', webhooksController.router)

}

module.exports = {
    startServer,
    createControlers
}
