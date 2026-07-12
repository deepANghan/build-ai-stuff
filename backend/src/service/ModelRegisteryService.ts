import { models } from "../config/ModelRegistery.js";

function getModels() {

    return models.filter((m) => m.enabled);

}

function getModel(modelId : string) {

    const model = models.find((m) => m.name == modelId);

    if(!model){

        throw new Error(
            "Model not found"
        );

    }


    return model;
}

export { getModel, getModels };