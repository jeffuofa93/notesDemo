import * as sst from "@serverless-stack/resources";

export default class ApiStack extends sst.Stack {
  // expose the api to the project
  api;

  constructor(scope, id, props) {
    super(scope, id, props);

    // i'm guessing this means the DynamoDB table must be passed in
    const { table } = props;

    // Create the new api
    this.api = new sst.Api(this, "Api", {
      defaultFunctionProps: {
        environment: {
          TABLE_NAME: table.tableName,
        },
      },
      routes: {
        "POST   /notes": "src/create.main",
        "GET    /notes/{id}": "src/get.main",
        "GET    /notes": "src/list.main",
        "PUT    /notes/{id}": "src/update.main",
        "DELETE /notes/{id}": "src/delete.main",
      },
    });

    // allows the api to access the DynamoDB table
    this.api.attachPermissions([table]);

    // show the API  endpoint in the output
    this.addOutputs({
      ApiEndpoint: this.api.url,
    });
  }
}
