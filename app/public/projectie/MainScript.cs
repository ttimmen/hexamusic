using UnityEngine;
using System.Collections;

public class MainScript : MonoBehaviour {

	GameObject[,] cubes;
	public int cubesX = 6;
	public int cubesY = 6;

	public float scaleX = 1;
	public float scaleY = 1;
	public float scaleZ = 1;

	public float rotationX = 0;
	public float rotationY = 0;

	public float spacingX = 0.5f;
	public float spacingY = 0.5f;
	public GameObject node;

	public TextMesh tagTM;
	public GUIText tagGT;
	public FollowGO followScript;


	private float[] spectrum;

	public Material cubeMat;

	public float beatZoom = 4;

	private float timerX = 0;
	private float timerY = 0;

	public float movementRateX = 0.01f;
	public float movementRateY = 0.015f;

	public float movementAmplifier = 10000;

	private Vector3 wantedPosition = Vector3.zero;

	private CC_HueSaturationValue hueComponent;

	//---- TESTVARS -----
	private float wantedScale = 1;

	private Vector3 lastMousePosition;

	private bool tagSet = false;

	void Start () {
		hueComponent = Camera.main.GetComponent<CC_HueSaturationValue> ();
		followScript = tagTM.gameObject.GetComponent<FollowGO> ();
		node = GameObject.Find ("Node");
		//cubes = new GameObject[40, 40];
		CreateCubes ();
		//CreateCubes ();
		spectrum = new float[64];
		//audio.clip = Microphone.Start("External microphone", true, 10, 44100);
		audio.clip = Microphone.Start(null, true, 10, 44100);
		audio.Play();
		//spectrum = new float[64];
		/*Debug.Log ("Mics:"+Microphone.devices.Length);
		foreach (string device in Microphone.devices)
		{
			Debug.Log("Name: " + device);
		}*/
		SetHue (20);
		SetColor ("#99FF99");
		StartCoroutine (ChangeNumberOfCubesCR ());
		StartCoroutine (ChangeWantedPositionCR ());
		//StartCoroutine (BeatCR ());
		StartCoroutine (ChangeScaleYCR ());
		StartCoroutine (ChangeScaleZCR ());
		StartCoroutine (ChangeSpacingXCR ());
		StartCoroutine (ChangeSpacingYCR ());
		//SetTag ("#blablah");
		//SetTagValue (20);
	}

	public IEnumerator ChangeWantedPositionCR(){
		yield return new WaitForSeconds (Random.Range (1, 4));
		ChangeWantedPosition();
		StartCoroutine(ChangeWantedPositionCR());
	}

	public void ChangeWantedPosition(){
		wantedPosition = new Vector3 (Random.Range (-2, 2), Random.Range (-2, 2), Random.Range (0, 15));
	}

	public void ChangeNumberOfCubes(){
		cubesX = Random.Range(2,15);
		cubesY = Random.Range(2,15);
	}

	public IEnumerator ChangeNumberOfCubesCR(){
		float wait = Random.Range (0, 4);
		//Debug.Log ("waiting " + wait);
		yield return new WaitForSeconds (wait);
		if (!tagSet) {
			tagTM.text = "";
			ChangeNumberOfCubes ();
		} else {
			tagSet = false;		
		}
		StartCoroutine(ChangeNumberOfCubesCR());
	}

	public IEnumerator ChangeScaleYCR(){
		yield return new WaitForSeconds (Random.value*4);
		SetScaleY(Random.Range(0.1f,7));
		StartCoroutine(ChangeScaleYCR());
	}

	public IEnumerator ChangeScaleZCR(){
		yield return new WaitForSeconds (Random.value*4);
		SetScaleZ(Random.Range(0.1f,5));
		StartCoroutine(ChangeScaleZCR());
   }

 	public IEnumerator ChangeSpacingXCR(){
		yield return new WaitForSeconds (Random.value*4);
		SetSpacingX(Random.Range (0.1f, 5));
		StartCoroutine(ChangeSpacingXCR());
	}

	public IEnumerator ChangeSpacingYCR(){
		yield return new WaitForSeconds (Random.value*4);
		SetSpacingY(Random.Range (0.1f, 5));
		StartCoroutine(ChangeSpacingYCR());
	}


	public IEnumerator BeatCR(){
		yield return new WaitForSeconds (0.45f);
		Beat();
		StartCoroutine(BeatCR());
	}

	void Update () {

		node.transform.position = Vector3.Lerp (node.transform.position, wantedPosition, Random.Range(0.1f,0.5f));

		//Debug.Log (spectrum [10]);
		for (var i = 1; i < 63; i++) {
			Debug.DrawLine (new Vector3 (i - 1, spectrum[i] + 10, 0),
			                new Vector3 (i, spectrum[i + 1] + 10, 0), Color.red);
			Debug.DrawLine (new Vector3 (i - 1, Mathf.Log(spectrum[i - 1]) + 10, 2),
			                new Vector3 (i, Mathf.Log(spectrum[i]) + 10, 2), Color.cyan);
			Debug.DrawLine (new Vector3 (Mathf.Log(i - 1), spectrum[i - 1] - 10, 1),
			                new Vector3 (Mathf.Log(i), spectrum[i] - 10, 1), Color.green);
			Debug.DrawLine (new Vector3 (Mathf.Log(i - 1), Mathf.Log(spectrum[i - 1]), 3),
			                new Vector3 (Mathf.Log(i), Mathf.Log(spectrum[i]), 3), Color.yellow);
		}

		//-----TESTING DYNAMIC INPUT
		if (Input.GetKeyDown (KeyCode.Space)) {
			Beat ();
		}

		if (Input.GetKeyDown ("c")) {
			TestColor();
		}

		if (Input.GetKeyDown ("r")) {
			Screen.SetResolution(1280,720,true);
		}

		//Debug.Log (Input.mousePosition.x+ " - " + lastMousePosition.x);

		SetRotateX (Input.mousePosition.x - lastMousePosition.x);

		SetRotateY (Input.mousePosition.y - lastMousePosition.y);

		CreateCubes ();

		lastMousePosition = Input.mousePosition;

		timerX += (movementRateX);
		timerY += (movementRateY);

		SetRotateX((Mathf.PerlinNoise (timerX, timerY) - 0.5f)*Time.deltaTime*movementAmplifier);
		SetRotateY((Mathf.PerlinNoise (timerY+1000, timerX+1000) - 0.5f)*Time.deltaTime*movementAmplifier);

	}

	void CreateCubes(){
			if (cubes != null) {
					cubes.Initialize ();
			}
			cubes = new GameObject[cubesX, cubesY];
			foreach (GameObject myCube in GameObject.FindGameObjectsWithTag("cube")) {
					Destroy (myCube);
			}
			
			//------BACK TO ORIGSCALE-------
			scaleX = Mathf.Lerp (scaleX, wantedScale, 4 * Time.deltaTime);
			//scaleY = Mathf.Lerp (scaleX, wantedScale, Time.deltaTime);
			//scaleZ = Mathf.Lerp (scaleX, wantedScale, Time.deltaTime);
			//------------------------------

			for (int i = 0; i < cubesX; i++) {
					for (int j = 0; j < cubesY; j++) {
							cubes [i, j] = GameObject.CreatePrimitive (PrimitiveType.Cube);
							cubes [i, j].transform.parent = node.transform;
							cubes [i, j].tag = "cube";
							cubes [i, j].transform.localScale = new Vector3 (scaleX, scaleY, scaleZ);
							cubes [i, j].transform.localPosition = new Vector3 (i * spacingX - (cubesX - 1) * spacingX / 2, j * spacingY - (cubesY - 1) * spacingY / 2, 0);
							cubes [i, j].renderer.material = cubeMat;
					}
			}
			
			
			node.transform.localEulerAngles = new Vector3(rotationX,rotationY,0);
	}

	public void SetColor (string myColor){
		float red = (HexToInt(myColor[2]) + HexToInt(myColor[1]) * 16.000f) / 255;
		float green = (HexToInt(myColor[4]) + HexToInt(myColor[3]) * 16.000f) / 255;
		float blue = (HexToInt(myColor[6]) + HexToInt(myColor[5]) * 16.000f) / 255;
		Color finalColor = new Color();
		finalColor.r = red;
		finalColor.g = green;
		finalColor.b = blue;
		finalColor.a = 1;
		cubeMat.color = finalColor;
	}

	public int HexToInt (char hexChar) {
		string hex = "" + hexChar;
		switch (hex) {
			case "0": return 0;
			case "1": return 1;
			case "2": return 2;
			case "3": return 3;
			case "4": return 4;
			case "5": return 5;
			case "6": return 6;
			case "7": return 7;
			case "8": return 8;
			case "9": return 9;
			case "A": return 10;
			case "B": return 11;
			case "C": return 12;
			case "D": return 13;
			case "E": return 14;
			case "F": return 15;
		}
		return 0;
	}

	public void SetCubesX(int myCubesX){
		cubesX = myCubesX;
	}

	public void SetCubesY(int  myCubesY){
		cubesY = myCubesY;
	}

	public void SetScaleX(float myScaleX){
		scaleX = myScaleX;
	}

	public void SetScaleY(float myScaleY){
		scaleY = myScaleY;
	}

	public void SetScaleZ(float myScaleZ){
		scaleZ = myScaleZ;
	}

	public void SetSpacingX(float mySpacingX){
		spacingX = mySpacingX;
	}

	public void SetSpacingY(float mySpacingY){
		spacingY = mySpacingY;
	}

	public void Beat(){
		scaleX = beatZoom * Random.Range(0.5f,3);
	}

	public void TestColor(){
		SetColor ("#0000FF");
	}

	public void SetRotateX(float myRotateX){
		rotationX += myRotateX;
	}

	public void SetRotateY(float myRotateY){
		rotationY += myRotateY;
	}

	public void SetImage(string url){
	
	}

	public void SetHue(float hue){
		hueComponent.hue = hue - 180;
	}

	public void SetTag(string myTag){
		tagTM.text = myTag;
		followScript.offset = Random.onUnitSphere * 4;
		tagSet = true;
	}

	public void SetTagValue(int myTagValue){
		myTagValue = Mathf.Clamp (myTagValue, 6, 100);
		tagSet = true;
		int rows = 2;
		if (myTagValue > 20) {
			rows = Random.Range (1, 20);
		} else if (myTagValue <= 20) {
			rows = Random.Range (1, 6);
		}
		int columns = myTagValue / rows;
		SetCubesX(rows);
		SetCubesY(columns);
	}
				                                                
}
