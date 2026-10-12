"""Inspectable gradients and a real PyTorch attention/encoder forward pass."""
import torch
from torch import nn

def demonstrate():
 w1=torch.tensor(2.,requires_grad=True);w2=torch.tensor(3.,requires_grad=True)
 x=torch.tensor(1.);y=w2*(w1*x);loss=(y-4)**2;loss.backward()
 assert w1.grad.item()==12 and w2.grad.item()==8
 q=torch.tensor([[[1.,0.]]]);k=torch.tensor([[[1.,0.],[0.,1.]]]);v=torch.tensor([[[4.,0.],[0.,2.]]])
 scores=q@k.transpose(-1,-2)/(2**.5);weights=torch.softmax(scores,dim=-1);output=weights@v
 assert torch.allclose(weights.sum(-1),torch.ones(1,1))
 block=nn.TransformerEncoderLayer(16,4,batch_first=True);block.eval()
 with torch.no_grad():assert block(torch.zeros(2,5,16)).shape==(2,5,16)
 return {'loss':loss.item(),'grad_w1':w1.grad.item(),'grad_w2':w2.grad.item(),'attention_weights':weights.tolist(),'attention_output':output.tolist()}
if __name__=='__main__':print(demonstrate())
