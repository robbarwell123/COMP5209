function fModifiedSankeyLayout(myData,iCurrUserID,oLayoutConfig)
{
	var arrNodes=[];
	for(var iDoWork=0;iDoWork<myData.nodes.length;iDoWork++)
	{
		var oNode=new Object();
		oNode.data=typeof myData.nodes[iDoWork].data==="undefined" ? myData.nodes[iDoWork] : myData.nodes[iDoWork].data;
		oNode.iSourceHeight=0;
		oNode.iTargetHeight=0;
		arrNodes.push(oNode.data.iUserID);
		myData.nodes[iDoWork]=oNode;
	}	

	for(var iDoWork=0;iDoWork<myData.links.length;iDoWork++)
	{
		var oNode=new Object();
		oNode.data=typeof myData.links[iDoWork].data==="undefined" ? myData.links[iDoWork] : myData.links[iDoWork].data;

		myData.nodes[arrNodes.indexOf(oNode.data.source)].iSourceHeight+=oNode.data.value;
		myData.nodes[arrNodes.indexOf(oNode.data.target)].iTargetHeight+=oNode.data.value;		
		
		myData.links[iDoWork]=oNode;
	}

	var iNodeTotal=0;
	
	for(var iDoWork=0;iDoWork<myData.nodes.length;iDoWork++)
	{
		if(myData.nodes[iDoWork].data.iUserID!=iCurrUserID)
		{
			iNodeTotal+=Math.max(myData.nodes[iDoWork].iSourceHeight,myData.nodes[iDoWork].iTargetHeight);
		}
	}	
	
	iNodeTotal+=(myData.nodes.length-2)*oLayoutConfig.iNodePadding;
	var myScale=d3.scaleLinear()
		.domain([0, iNodeTotal])
		.range([0,oLayoutConfig.iHeight]);

	var iCurrNodeSize=0;
	for(var iDoWork=0;iDoWork<myData.nodes.length;iDoWork++)
	{
		if(myData.nodes[iDoWork].data.iUserID!=iCurrUserID)
		{
			iCurrNodeSize+=Math.max(myScale(myData.nodes[iDoWork].iSourceHeight),myScale(myData.nodes[iDoWork].iTargetHeight));
		}
	}	

	var iCurrY=0;
	var iMidY=0;

	var arrNewNodes=[];
	var arrNewNodesIdx=[];
	for(var iDoWork=0;iDoWork<myData.nodes.length;iDoWork++)
	{
		if(myData.nodes[iDoWork].data.iUserID!=iCurrUserID)
		{
			myData.nodes[iDoWork].y=iCurrY;
			iCurrY+=Math.max(myScale(myData.nodes[iDoWork].iSourceHeight),myScale(myData.nodes[iDoWork].iTargetHeight))+oLayoutConfig.iNodePadding;
			myData.nodes[iDoWork].midy=iMidY+Math.max(myScale(myData.nodes[iDoWork].iSourceHeight),myScale(myData.nodes[iDoWork].iTargetHeight))/2;
			iMidY+=Math.max(myScale(myData.nodes[iDoWork].iSourceHeight),myScale(myData.nodes[iDoWork].iTargetHeight));
			myData.nodes[iDoWork].sourcex=oLayoutConfig.iOffsetWidth;
			myData.nodes[iDoWork].targetx=oLayoutConfig.iWidth-oLayoutConfig.iNodeWidth-oLayoutConfig.iOffsetWidth;
			if(myData.nodes[iDoWork].iSourceHeight>0)
			{
				var oNewNode=new Object();
				oNewNode.id="S"+myData.nodes[iDoWork].data.iUserID;
				oNewNode.data=myData.nodes[iDoWork].data;
				oNewNode.width=oLayoutConfig.iNodeWidth;
				oNewNode.height=myData.nodes[iDoWork].iSourceHeight;
				oNewNode.y=myData.nodes[iDoWork].y;
				oNewNode.x=myData.nodes[iDoWork].sourcex;
				oNewNode.type=myData.nodes[iDoWork].iTargetHeight==0 ? "Single" : "Multiple";
				arrNewNodes.push(oNewNode);
				arrNewNodesIdx.push(oNewNode.id);
			}
			if(myData.nodes[iDoWork].iTargetHeight>0)
			{
				var oNewNode=new Object();
				oNewNode.id="T"+myData.nodes[iDoWork].data.iUserID;
				oNewNode.data=myData.nodes[iDoWork].data;
				oNewNode.width=oLayoutConfig.iNodeWidth;
				oNewNode.height=myData.nodes[iDoWork].iTargetHeight;
				oNewNode.y=myData.nodes[iDoWork].y;
				oNewNode.x=myData.nodes[iDoWork].targetx;
				oNewNode.type=myData.nodes[iDoWork].iSourceHeight==0 ? "Single" : "Multiple";
				arrNewNodes.push(oNewNode);
				arrNewNodesIdx.push(oNewNode.id);
			}
		}else
		{
			myData.nodes[iDoWork].y=(oLayoutConfig.iHeight-Math.max(myScale(myData.nodes[iDoWork].iSourceHeight),myScale(myData.nodes[iDoWork].iTargetHeight)))/2;
			myData.nodes[iDoWork].sourcex=(oLayoutConfig.iWidth/2)-(oLayoutConfig.iNodeWidth/2);
			myData.nodes[iDoWork].targetx=(oLayoutConfig.iWidth/2)-(oLayoutConfig.iNodeWidth/2);			
			var oNewNode=new Object();
			oNewNode.id=myData.nodes[iDoWork].data.iUserID;
			oNewNode.data=myData.nodes[iDoWork].data;
			oNewNode.width=oLayoutConfig.iNodeWidth;
			oNewNode.height=iCurrNodeSize;
			oNewNode.y=myData.nodes[iDoWork].y;
			oNewNode.x=myData.nodes[iDoWork].targetx;
			oNewNode.type="Multiple";
			arrNewNodes.push(oNewNode);
			arrNewNodesIdx.push(oNewNode.id);
		}
	}	

	var iYCurrUser=arrNewNodes[arrNewNodesIdx.indexOf(iCurrUserID)].y;
	
	for(var iDoWork=0;iDoWork<myData.links.length;iDoWork++)
	{
		idx1=myData.links[iDoWork].data.source==iCurrUserID ? iCurrUserID : "S"+myData.links[iDoWork].data.source;
		idx2=myData.links[iDoWork].data.target==iCurrUserID ? iCurrUserID : "T"+myData.links[iDoWork].data.target;

		iStroke=idx1==iCurrUserID ? arrNewNodes[arrNewNodesIdx.indexOf(idx2)].height : arrNewNodes[arrNewNodesIdx.indexOf(idx1)].height;
		iOffset=iStroke/2;
		
		myData.links[iDoWork].id=idx1+"-"+idx2;
		myData.links[iDoWork].classid=myData.links[iDoWork].data.source==iCurrUserID ? myData.links[iDoWork].data.target : myData.links[iDoWork].data.source;
		myData.links[iDoWork].iStroke=iStroke;
		myData.links[iDoWork].x1=arrNewNodes[arrNewNodesIdx.indexOf(idx1)].x+oLayoutConfig.iNodeWidth;
		myData.links[iDoWork].y1=idx1==iCurrUserID ? iYCurrUser+myData.nodes[arrNodes.indexOf(myData.links[iDoWork].data.target)].midy : arrNewNodes[arrNewNodesIdx.indexOf(idx1)].y+arrNewNodes[arrNewNodesIdx.indexOf(idx1)].height/2;
		myData.links[iDoWork].x2=arrNewNodes[arrNewNodesIdx.indexOf(idx2)].x;
		myData.links[iDoWork].y2=idx2==iCurrUserID ? iYCurrUser+myData.nodes[arrNodes.indexOf(myData.links[iDoWork].data.source)].midy : arrNewNodes[arrNewNodesIdx.indexOf(idx2)].y+arrNewNodes[arrNewNodesIdx.indexOf(idx2)].height/2;
		myData.links[iDoWork].sUnique=idx1==iCurrUserID ? arrNewNodes[arrNewNodesIdx.indexOf(idx2)].type : arrNewNodes[arrNewNodesIdx.indexOf(idx1)].type ;
	}
	
	var oRtn=new Object();
	oRtn.nodes=arrNewNodes;
	oRtn.links=myData.links;
	
	return oRtn;
}